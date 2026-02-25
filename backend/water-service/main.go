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

type WaterQuality struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PH          float64   `json:"ph"`
	Temperature float64   `json:"temperature"`
	CreatedAt   time.Time `json:"createdAt"`
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

	// auto migrate tabel WaterQuality
	log.Println("Sinkronisasi tabel Water Quality ke PostgreSQL...")
	DB.AutoMigrate(&WaterQuality{})

	app := fiber.New()
	app.Use(cors.New())

	// Root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Water Quality Microservice Berhasil Berjalan!"})
	})

	// Monitoring Kualitas Air
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

	// Run Server di Port 3001
	log.Println("🚀 Water Quality Service siap di port 3001")
	log.Fatal(app.Listen(":3001"))
}