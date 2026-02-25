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

	// auto migrate tabel DeviceStatus
	log.Println("Sinkronisasi tabel Device Status ke PostgreSQL...")
	DB.AutoMigrate(&DeviceStatus{})

	app := fiber.New()
	app.Use(cors.New())

	// root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Device Status Microservice Berhasil Berjalan!"})
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

	// Run Server di Port 3003
	log.Println("🚀 Device Status Service siap di port 3003")
	log.Fatal(app.Listen(":3003"))
}