# NEXUS Server Operations Dashboard

Dashboard untuk memantau metrik sistem dan menguji koneksi SSH ke server. Proyek ini terdiri dari frontend Vue 3 + TypeScript dan backend FastAPI.

## Fitur

- Ringkasan penggunaan CPU, memori, disk, dan uptime mesin yang menjalankan backend.
- Grafik metrik yang diperbarui setiap 3 detik.
- Pengaturan ambang batas alert yang disimpan di browser.
- Endpoint untuk memeriksa koneksi SSH dengan verifikasi host key.
- PostgreSQL lokal melalui Docker Compose.

## Persyaratan

- Python 3.10 atau lebih baru
- Node.js dan npm
- Docker Desktop (opsional, untuk PostgreSQL)

## Menjalankan backend

Dari root proyek, buat dan aktifkan virtual environment:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirement.txt
pip install asyncssh
uvicorn app.main:app --reload --port 8000
```

Backend berjalan di `http://localhost:8000`. Dokumentasi API tersedia di `http://localhost:8000/docs`.

Endpoint utama:

- `GET /api/health` — status backend
- `GET /api/metrics` — metrik mesin tempat backend berjalan
- `POST /api/ssh/test` — menguji koneksi SSH

Untuk pengujian SSH, sediakan file `backend/known_hosts` berisi host key server yang dipercaya. File ini bersifat lokal dan tidak disertakan di Git.

## Menjalankan frontend

Buka terminal lain dari root proyek, lalu jalankan:

```powershell
cd frontend
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite (biasanya `http://localhost:5173`). Frontend mengambil metrik dari `http://localhost:8000`, jadi backend perlu berjalan juga.

Untuk membuat build produksi:

```powershell
cd frontend
npm run build
```

## PostgreSQL (opsional)

Docker Compose membutuhkan nilai `POSTGRES_PASSWORD` di file `.env` pada root proyek:

```env
POSTGRES_PASSWORD=ganti-dengan-password-lokal
```

Jalankan database dengan:

```powershell
docker compose up -d postgres
```

Database tersedia hanya di mesin lokal pada port `5432`. Data disimpan di Docker volume `postgres_data`.

## Struktur proyek

```text
backend/       FastAPI API dan dependensi Python
frontend/      Vue, TypeScript, dan Vite
docker-compose.yaml
```
