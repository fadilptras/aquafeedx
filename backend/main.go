package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type WaterQuality struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PH          float64   `json:"ph"`
	Temperature float64   `json:"temperature"`
	CreatedAt   time.Time `json:"createdAt"`
}

type FeedingSchedule struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Time      *pq.StringArray `gorm:"type:text[]" json:"time"` // Array string untuk jam pakan
	IsActive  bool      `gorm:"default:true" json:"isActive"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type DeviceStatus struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	DeviceName     string    `gorm:"unique;default:ESP32-AquaFeedX" json:"deviceName"`
	IsOnline       bool      `gorm:"default:false" json:"isOnline"`
	WifiSSID       string    `json:"wifiSSID"`
	WifiSignal     int       `json:"wifiSignal"`
	IPAddress      string    `json:"ipAddress"`
	UptimeSeconds  int       `gorm:"default:0" json:"uptimeSeconds"`
	LastHeartbeat  time.Time `gorm:"default:now()" json:"lastHeartbeat"`
	OverallStatus  string    `gorm:"default:Normal" json:"overallStatus"`
}

var DB *gorm.DB

func main() {
	// cek env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Gagal memuat file .env")
	}

	// Konek Db
	dsn := os.Getenv("DATABASE_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi database: ", err)
	}

	// Auto Migrate Semua Tabel Sekaligus
	log.Println("Sinkronisasi tabel ke PostgreSQL...")
	DB.AutoMigrate(&WaterQuality{}, &FeedingSchedule{}, &DeviceStatus{})

	app := fiber.New()
	app.Use(cors.New())


	// Root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "API AquaFeedX Multi-Table Berhasil Berjalan!"})
	})

	// Monitoring Kualitas Air (Untuk ESP32) 
	app.Post("/api/water-quality", func(c *fiber.Ctx) error {
		data := new(WaterQuality)
		if err := c.BodyParser(data); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Format data sensor salah"})
		}
		DB.Create(&data)
		return c.Status(201).JSON(data)
	})

	app.Get("/api/water-quality", func(c *fiber.Ctx) error {
		var history []WaterQuality
		DB.Order("created_at desc").Limit(10).Find(&history)
		return c.JSON(history)
	})

	// API Jadwal Pakan
	app.Get("/api/schedules", func(c *fiber.Ctx) error {
		var schedules []FeedingSchedule
		// Ambil data berdasarkan update terbaru
		DB.Order("updated_at desc").Find(&schedules)
		return c.JSON(schedules)
	})

	app.Post("/api/schedules", func(c *fiber.Ctx) error {
		schedule := new(FeedingSchedule)
		if err := c.BodyParser(schedule); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Format JSON salah"})
		}

		// Pastikan UpdatedAt diisi
		schedule.UpdatedAt = time.Now()

		// GUNAKAN log untuk melihat data sebelum simpan
		log.Printf("Data masuk: %+v", schedule)

		// Simpan ke database
		if err := DB.Create(&schedule).Error; err != nil {
			log.Println("Gagal menyimpan ke DB:", err)
			return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan ke database: " + err.Error()})
		}
		
		return c.Status(201).JSON(schedule)
	})

	// Status Perangkat (Heartbeat ESP32)
	app.Post("/api/device/heartbeat", func(c *fiber.Ctx) error {
		status := new(DeviceStatus)
		if err := c.BodyParser(status); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid heartbeat data"})
		}
		
		// Update data jika deviceName sudah ada, jika tidak ada maka buat baru
		DB.Where(DeviceStatus{DeviceName: status.DeviceName}).Assign(status).FirstOrCreate(&status)
		return c.JSON(status)
	})

	// 	Run Server
	log.Println("🚀 AquaFeedX Backend siap di port 3000")
	log.Fatal(app.Listen(":3000"))
}