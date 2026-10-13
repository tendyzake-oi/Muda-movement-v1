# Muda Movement — Landing Page

React 19 + Vite. Tema terang/gelap, responsif, tanpa library UI tambahan.

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan
npm run build    # build produksi → folder dist/
npm run lint     # cek kualitas kode
```

## Login member dan backend

Frontend memiliki route publik `/`, `/login`, dan `/reset-password`, serta route
dashboard terproteksi di `/dashboard`. Token JWT disimpan di `sessionStorage` dan sesi diverifikasi
kembali melalui `GET /api/auth/me`. Konfigurasi Vite meneruskan `/api` ke backend
port 3001; konfigurasi proxy tersebut dipertahankan.

### Menyiapkan database dan backend

1. Buat database dan tabel dari MySQL/TiDB SQL editor dengan menjalankan
   `backend/sql/setup.sql`. Pastikan database aktif di MySQL80 dan tabel `users`
   sudah tersedia.
2. Atur `backend/.env` sesuai database. Untuk MySQL lokal gunakan host
   `127.0.0.1`, port `3306`, `DB_SSL=false`, dan username/password MySQL Anda.
   Untuk TiDB Cloud gunakan endpoint cluster, port dan credential dari TiDB,
   serta `DB_SSL=true`. Isi `DB_NAME` sesuai database yang dibuat.
   Jangan memakai port SQL editor atau port TiDB untuk MySQL lokal.
3. Isi `JWT_SECRET` (minimal 32 karakter acak; buat dengan
   `node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"`)
   dan `WHATSAPP_GROUP_URL` di `backend/.env`.
   Atur juga `FRONTEND_URL` ke alamat frontend. Untuk mengaktifkan reset
   password lewat email, isi `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (`true`
   untuk TLS langsung, umumnya port 465; `false` untuk STARTTLS, umumnya port
   587), `SMTP_USER`, dan `SMTP_PASSWORD`. `SMTP_USER` adalah akun yang
   diautentikasi atau alias yang telah diizinkan penyedia SMTP. `SMTP_FROM`
   opsional dan secara default menggunakan `SMTP_USER`. Untuk Gmail dengan
   2-Step Verification, gunakan App Password, bukan password login Gmail.
   `CORS_ORIGIN` dapat berisi beberapa origin dipisahkan koma saat deployment.
   Jalankan ulang `backend/sql/setup.sql` agar tabel token reset tersedia.
4. Di terminal pertama:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

5. Di terminal kedua:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Buka `http://localhost:5173/login`, pilih **Daftar di sini**, isi nama, email,
   dan password. Akun langsung aktif dan sesi masuk ke dashboard setelah berhasil
   mendaftar. Coba juga buka `/dashboard` saat logout untuk memastikan halaman
   dialihkan ke `/login`.

Semua akun memiliki satu peran, `user`. API autentikasi dan pengelolaan akun:

- `POST /api/auth/register` mendaftarkan akun dan langsung mengembalikan JWT. 
- `POST /api/auth/login` masuk dengan email dan password.
- `POST /api/auth/password-reset/request` meminta tautan reset lewat email; respons
  tidak mengungkap apakah email terdaftar dan dibatasi lima permintaan per 15 menit.
- `POST /api/auth/password-reset/confirm` mengatur password baru menggunakan token
  sekali pakai yang kedaluwarsa setelah 30 menit.
- `GET /api/auth/me` membaca profil menggunakan token sesi yang valid.
- `PATCH /api/auth/me` mengubah nama dan email milik akun yang sedang masuk.
- `PATCH /api/auth/me/password` mengganti password setelah memverifikasi password lama.
- `DELETE /api/auth/me` menghapus akun sendiri setelah konfirmasi password.

`GET /api/config` mengirimkan URL grup WhatsApp dari konfigurasi backend tanpa
menanam tautan grup ke banyak file frontend. Respons autentikasi hanya memuat
nama, email, peran `user`, dan tanggal bergabung—tidak pernah `password_hash`.
Di dashboard, permintaan reset password dikirim ke email akun sehingga tidak
meminta password lama; pastikan email tersebut dapat diakses.

### Deployment (Vercel + TiDB Cloud)

Frontend Vite/React dan backend Express dapat di-deploy sebagai dua project
Vercel terpisah dari repository yang sama. Backend mengekspor aplikasi Express
untuk Vercel Functions; `npm start` tetap menjalankan server lokal dengan
`app.listen()`.

Sebelum deploy:

1. Siapkan cluster dan database di TiDB Cloud, lalu jalankan
   `backend/sql/setup.sql` di database tersebut. Pastikan tabel `users` dan
   `password_reset_tokens` sudah ada.
2. Di Vercel, buat project backend dari repository yang sama dan atur **Root
   Directory** ke `backend`. Gunakan framework Express dan install command
   `npm install` (tidak perlu build command khusus).
3. Tambahkan environment variables backend di Vercel Project Settings:
   `NODE_ENV=production`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
   `DB_NAME`, `DB_SSL=true`, `JWT_SECRET` (acak, minimal 32 karakter),
   `CORS_ORIGIN` (origin Vercel frontend), `FRONTEND_URL` (alamat frontend
   Vercel), `WHATSAPP_GROUP_URL`, serta konfigurasi `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, dan `SMTP_FROM`.
   Simpan rahasia di Environment Variables project backend Vercel; jangan
   masukkan rahasia ke source frontend atau repository.
   Ambil `DB_HOST`, `DB_PORT`, `DB_USER`, dan nama database dari detail koneksi
   TiDB yang sama dengan koneksi yang sudah diuji lokal. Port TiDB Cloud sering
   `4000`; jangan memakai `3306` kecuali memang port yang ditampilkan cluster.
   Setelah mengubah environment variables, deploy ulang project backend.
4. `DB_SSL_CA` opsional untuk CA PEM jika cluster mensyaratkannya. Koneksi
   `DB_SSL=true` memverifikasi sertifikat server dan menggunakan TLS minimal
   1.2; jangan menonaktifkan verifikasi untuk mengatasi masalah koneksi.
   Atur izin jaringan TiDB agar menerima koneksi dari backend hosting. Jika
   koneksi dari lokal berhasil tetapi `/api/healthz/database` di Vercel masih
   HTTP 503, periksa ulang environment variables di project backend Vercel,
   port/host cluster, dan allowlist jaringan TiDB untuk koneksi keluar Vercel.
   Jika platform menyediakan outbound IP statis, batasi allowlist TiDB ke IP
   itu; jangan membuka akses database ke semua alamat jika bisa dihindari.
5. Deploy backend dengan `cd backend` lalu `npx vercel --prod`. Tes
   `https://<domain-backend>/api/healthz` sampai mendapat respons
   `{"status":"ok"}`. Tes koneksi TiDB secara terpisah melalui
   `GET /api/healthz/database`; sukses memberi
   `{"status":"ok","database":"connected"}`, sedangkan database yang belum
   tersedia atau tabel autentikasi belum dibuat memberi HTTP 503 tanpa
   mematikan health check dasar. Lihat log backend Vercel untuk penyebab
   koneksi. Respons health check menyertakan kategori `reason` tanpa
   membocorkan host atau kredensial: `configuration`, `schema`, `credentials`,
   `database-name`, `dns`, `network-timeout`, `network-access`, `tls`,
   `protocol`, atau `unknown`.
6. Di Vercel, import repository dan pilih root directory `frontend`
   (framework Vite, build command `npm run build`, output directory `dist`).
   Isi `VITE_API_URL` dengan origin backend (tanpa `/api` dan tanpa slash di
   akhir); bila kosong pada build production, frontend memakai origin backend
   production yang ditetapkan di `frontend/src/services/auth.js`. Rewrite Vercel
   untuk route SPA sudah disediakan di `vercel.json`; selama development lokal
   variabel ini boleh kosong karena proxy Vite tetap digunakan.
7. Tes daftar akun, login, refresh halaman `/dashboard`, ubah profil, serta alur
   reset password dan tautan email. Pastikan `FRONTEND_URL` menunjuk domain
   frontend produksi agar tautan reset kembali ke situs yang benar.

Backend tidak boleh menerima `CORS_ORIGIN=http://localhost:5173` saja di
production. Isi dengan origin persis frontend Vercel (tanpa path), dan tambahkan
origin preview hanya jika memang dibutuhkan. `JWT_SECRET` wajib unik dan kuat;
server lokal menolak secret yang tidak ada atau kurang dari 32 karakter.
Gunakan `.env.example` sebagai referensi lokal, bukan sebagai tempat menyimpan
credential produksi.

Backend ini belum menyediakan `GET /api/news`; bagian berita frontend
memerlukan API berita tersendiri yang mengembalikan format data yang digunakan
komponen berita. Health check dan tes autentikasi tidak memvalidasi fitur berita.

## Susunan halaman

Halaman utama disusun berurutan: Hero, Tentang Kami, Program Kami, Portofolio/Produk,
Event, Partner Kolaborasi, lalu Kontak. Urutan section diatur di `src/App.jsx`.

## Struktur folder

```
src/
├── main.jsx                  # entry point: memuat font + style global
├── App.jsx                   # susunan halaman (urutan section)
│
├── data/
│   └── content.js            # ⭐ SEMUA teks & data. Ubah konten cukup di sini.
│
├── styles/
│   ├── tokens.css            # ⭐ warna, font, radius, tema terang & gelap
│   └── base.css              # reset, tipografi dasar, .container, .section
│
├── hooks/
│   └── useTheme.js           # logika tema (localStorage + preferensi sistem)
│
└── components/
    ├── ui/                   # potongan kecil yang dipakai berulang
    │   ├── Button, Icon, IconTile, SectionHeading
    ├── layout/               # kerangka halaman
    │   ├── Navbar, ThemeToggle, Footer
    └── sections/             # satu file = satu bagian halaman
        ├── Hero, About, Programs, Portfolio
        └── Events, Partners, Contact
```

Setiap komponen punya file `.css` dengan nama sama di sebelahnya.

## Cara kerja tema gelap/terang

- Tema disimpan di atribut `<html data-theme="light|dark">`.
- `index.html` memasang tema sebelum React dimuat (tidak ada kedipan putih).
- Urutan penentuan: pilihan tersimpan → preferensi sistem → terang.
- Warna didefinisikan sebagai variabel di `styles/tokens.css`
  (blok `:root` untuk terang, `:root[data-theme='dark']` untuk gelap).
- **Aturan penting:** di CSS komponen, pakai `var(--color-...)`, jangan kode hex langsung.

## Tugas umum

| Ingin…                         | Edit…                                      |
| ------------------------------ | ------------------------------------------ |
| Ganti teks / nama program     | `src/data/content.js`                      |
| Ganti warna / font             | `src/styles/tokens.css`                    |
| Tambah / hapus section         | `src/App.jsx` + file di `sections/`        |
| Tambah ikon                    | `src/components/ui/Icon.jsx`               |
| Tambah logo partner           | `Assets/brands/`                           |
| Hubungkan form kontak ke backend | `handleSubmit` di `sections/Contact.jsx` |
