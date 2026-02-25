@echo off
echo Run AquaFeedX Microservices...
echo ==========================================

echo [1/4] Memulai Water Quality Service (Port 3001)...
start "Water Service" cmd /k "cd water-service && go run main.go"

echo [2/4] Memulai Feeding Schedule Service (Port 3002)...
start "Schedule Service" cmd /k "cd schedule-service && go run main.go"

echo [3/4] Memulai Device Status Service (Port 3003)...
start "Device Service" cmd /k "cd device-service && go run main.go"
    
echo [4/4] Memulai Settings Service (Port 3004)...
start "Settings Service" cmd /k "cd setting-service && go run main.go"

echo Semua service berhasil dijalankan di jendela baru!
