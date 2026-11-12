# KANTIN 14 FAKULTAS UNIVERSITAS INDONESIA (KANTIN UI)

> **Proyek Mata Kuliah:** Dasar-Dasar Pemrograman 1 (DDP1)  
> **Tim Pengembang:** Claudeholic (Lead: Ghalindra) — Program Studi Sistem Informasi  
> **Fakultas:** Fakultas Ilmu Komputer, Universitas Indonesia (Fasilkom UI)  
> **Slogan Randomizer:** *"Makan apa hari ini?"*  
> **Desain & Tema:** Palette Warna Biru & Merah, Lucide Icons (Bebas Emoji)

---

## 1. Gambaran Umum Proyek

**Kantin UI** adalah portal direktori dan platform rekomendasi kuliner interaktif untuk **14 Fakultas di Universitas Indonesia (UI)**. Dilengkapi denah interaktif kampus, sistem filter pencarian menu dan harga, serta fitur pintar **Food Randomizer** ("Makan apa hari ini?") yang dapat mengacak makanan, minuman, maupun paket kombo sekaligus.

---

## 2. Struktur Database (Relasi Tiga Tingkat)

```text
[ Faculty (14 Fakultas) ] ── (1:N) ──> [ Booth (Stan Kantin) ] ── (1:N) ──> [ Menu (Makanan/Minuman) ]
```

1. **Model `Faculty`:**
   - Menyimpan data 14 Fakultas UI dalam 3 Rumpun Ilmu (Saintek, Soshum, IKES).
   - Field: `name`, `short_name`, `canteen_name`, `cluster`, `description`, `icon`.
2. **Model `Booth`:**
   - Stan penjual di kantin fakultas UI.
   - Field: `faculty` (ForeignKey), `name`, `location`, `map_code`, `description`, `image`.
3. **Model `Menu`:**
   - Daftar makanan, minuman, dan camilan.
   - Field: `booth` (ForeignKey CASCADE), `name`, `category`, `price`, `description`, `is_available`.

---

## 3. Cara Menjalankan Secara Lokal (Local Development)

Buka terminal di folder proyek di VS Code, lalu jalankan:

```powershell
.\.venv\Scripts\python.exe manage.py runserver
```

Akses melalui browser:
- **Website Utama:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Panel Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
  - **Username:** `Ghalindra`
  - **Password:** `123456789ABC`

Menjalankan Unit Test otomatis:
```powershell
.\.venv\Scripts\python.exe manage.py test
```

---

## 4. Panduan Import ke GitHub

Proyek ini telah diinisialisasi Git lokal dan memiliki file `.gitignore` lengkap. Ikuti langkah berikut untuk mengunggah ke akun GitHub Anda:

1. Buat repository baru di [GitHub](https://github.com/new) (misalnya beri nama `kantin-ui-ddp1`), biarkan kosong tanpa README/license.
2. Buka terminal di folder proyek dan jalankan perintah:

```powershell
# Hubungkan dengan URL repository GitHub Anda
git remote add origin https://github.com/USERNAME-ANDA/kantin-ui-ddp1.git

# Pastikan branch bernama main
git branch -M main

# Unggah seluruh source code ke GitHub
git push -u origin main
```

---

## 5. Panduan Deploy ke Vercel

Proyek ini telah dilengkapi file konfigurasi `vercel.json`, `build_files.sh`, dan `requirements.txt`:

### Opsi A: Deploy Otomatis via GitHub (Paling Mudah)
1. Buka dashboard [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository `kantin-ui-ddp1` yang baru Anda push ke GitHub, lalu klik **"Import"**.
4. Di bagian **Environment Variables** (opsional tapi disarankan):
   - Tambahkan `DEBUG` = `False`
   - Tambahkan `SECRET_KEY` = `isi-dengan-string-rahasia-bebas`
5. Klik **"Deploy"**. Vercel akan otomatis menjalankan `build_files.sh`, menginstall dependensi, mengumpulkan aset statis (`collectstatic`), dan menerbitkan URL website Anda (`https://nama-proyek.vercel.app`).

### Opsi B: Deploy via Vercel CLI
```powershell
# Install Vercel CLI (jika belum ada)
npm i -g vercel

# Login dan deploy
vercel
```
