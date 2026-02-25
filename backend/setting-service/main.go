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

type Settings struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	DeviceName   string    `json:"deviceName"`
	PoolLocation string    `json:"poolLocation"`
	FishType     string    `json:"fishType"`
	PoolVolume   float64   `json:"poolVolume"`
	FeedCapacity float64   `json:"feedCapacity"`
	InstallDate  string    `json:"installDate"`
	TempMin      float64   `json:"tempMin"`
	TempMax      float64   `json:"tempMax"`
	PhMin        float64   `json:"phMin"`
	PhMax        float64   `json:"phMax"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

var DB *gorm.DB

func main() {
	// 1. Load env file
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("Gagal memuat file .env")
	}

	// 2. Koneksi ke Database PostgreSQL
	dsn := os.Getenv("DATABASE_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi database: ", err)
	}

	// 3. Auto Migrate (Membuat tabel otomatis jika belum ada)
	log.Println("Sinkronisasi tabel Settings ke PostgreSQL...")
	DB.AutoMigrate(&Settings{})

	// 4. Setup Fiber
	app := fiber.New()
	app.Use(cors.New())

	// Root Endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Settings Microservice Berjalan di Port 3004!"})
	})

	// API: Ambil Pengaturan (GET) murni dari database
	app.Get("/api/settings", func(c *fiber.Ctx) error {
		var config Settings
		
		// Cari data config pertama di database
		result := DB.First(&config)
		
		// Jika data tidak ditemukan atau terjadi error, kembalikan response error
		if result.Error != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Data pengaturan belum ada di database",
			})
		}

		// Jika ada, langsung kembalikan datanya
		return c.JSON(config)
	})

	// API: Simpan/Perbarui Pengaturan (POST)
	app.Post("/api/settings", func(c *fiber.Ctx) error {
		var payload Settings
		
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Format JSON salah"})
		}

		// Paksa ID menjadi 1 agar selalu menimpa record yang sama (Single Row Configuration)
		payload.ID = 1
		payload.UpdatedAt = time.Now()

		// DB.Save akan melakukan UPDATE jika ID sudah ada, atau INSERT jika ID belum ada
		if err := DB.Save(&payload).Error; err != nil {
			log.Println("Gagal menyimpan pengaturan:", err)
			return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan ke database"})
		}

		return c.Status(200).JSON(fiber.Map{
			"message": "Pengaturan berhasil disimpan",
			"data":    payload,
		})
	})

	// 5. Jalankan Server
	log.Println("🚀 Settings Service siap di port 3004")
	log.Fatal(app.Listen(":3004"))
}