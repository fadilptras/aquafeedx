package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type FeedingSchedule struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Time      string    `json:"time"` // (contoh: "08:00")
	IsActive  bool      `gorm:"default:true" json:"isActive"`
	UpdatedAt time.Time `json:"updatedAt"`
}

var DB *gorm.DB

func main() {
	// cek env
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("Gagal memuat file .env")
	}

	// konek Db
	dsn := os.Getenv("DATABASE_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi database: ", err)
	}

	// Hanya Auto Migrate Tabel FeedingSchedule
	log.Println("Sinkronisasi tabel Feeding Schedule ke PostgreSQL...")
	DB.AutoMigrate(&FeedingSchedule{})

	app := fiber.New()
	app.Use(cors.New())

	// Root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Feeding Schedule Microservice Berhasil Berjalan!"})
	})

	// API Jadwal Pakan (Ambil semua data jadwal)
	app.Get("/api/schedules", func(c *fiber.Ctx) error {
		var schedules []FeedingSchedule
		DB.Order("updated_at desc").Find(&schedules)
		return c.JSON(schedules)
	})

	// API untuk sinkronisasi massal (Hapus semua data lama, lalu insert data baru)
	app.Post("/api/schedules/sync", func(c *fiber.Ctx) error {
		var schedules []FeedingSchedule
		if err := c.BodyParser(&schedules); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Format JSON salah"})
		}

		// Hapus semua data jadwal yang ada di database saat ini
		DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&FeedingSchedule{})

		// Set waktu update dan status aktif untuk setiap jadwal baru
		for i := range schedules {
			schedules[i].UpdatedAt = time.Now()
			schedules[i].IsActive = true
		}

		// Insert data baru jika array tidak kosong
		if len(schedules) > 0 {
			if err := DB.Create(&schedules).Error; err != nil {
				log.Println("Gagal menyimpan ke DB:", err)
				return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan ke database: " + err.Error()})
			}
		}

		return c.Status(201).JSON(fiber.Map{"message": "Jadwal berhasil disinkronisasi", "data": schedules})
	})

	// API Post single data (Opsional jika masih butuh nambah 1 per 1 dari tempat lain)
	app.Post("/api/schedules", func(c *fiber.Ctx) error {
		schedule := new(FeedingSchedule)
		if err := c.BodyParser(schedule); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Format JSON salah"})
		}

		schedule.UpdatedAt = time.Now()

		log.Printf("Data masuk: %+v", schedule)

		if err := DB.Create(&schedule).Error; err != nil {
			log.Println("Gagal menyimpan ke DB:", err)
			return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan ke database: " + err.Error()})
		}

		return c.Status(201).JSON(schedule)
	})

	// Run Server di Port 3000
	log.Println("🚀 Feeding Schedule Service siap di port 3000")
	log.Fatal(app.Listen(":3000"))
}