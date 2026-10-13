# Muda Movement — Landing Page

React 19 + Vite. Tema terang/gelap, responsif, tanpa library UI tambahan.

## Menjalankan

Jalankan perintah dari root repository:

```bash
npm install
npm run dev:frontend   # mode pengembangan frontend
npm run dev:backend    # jalankan backend di terminal lain
npm run build          # build frontend produksi
npm run lint           # cek kualitas frontend
```

## Login member dan backend

Frontend memiliki route publik `/` dan `/login`, serta route dashboard terproteksi
di `/dashboard`. Token JWT disimpan di `sessionStorage` dan sesi diverifikasi
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
   `CORS_ORIGIN` dapat berisi beberapa origin dipisahkan koma saat deployment.
3. Di terminal pertama dari root repository:

   ```bash
   npm run dev:backend
   ```

4. Di terminal kedua:

   ```bash
   npm run dev:frontend
   ```

   Buka `http://localhost:5173/login`, pilih **Daftar di sini**, isi nama, email,
   dan password. Akun langsung aktif dan sesi masuk ke dashboard setelah berhasil
   mendaftar. Coba juga buka `/dashboard` saat logout untuk memastikan halaman
   dialihkan ke `/login`.

Semua akun memiliki satu peran, `user`. API autentikasi dan pengelolaan akun:

- `POST /api/auth/register` mendaftarkan akun dan langsung mengembalikan JWT.
- `POST /api/auth/login` masuk dengan email dan password.
- `GET /api/auth/me` membaca profil menggunakan token sesi yang valid.
- `PATCH /api/auth/me` mengubah nama dan email milik akun yang sedang masuk.
- `PATCH /api/auth/me/password` mengganti password setelah memverifikasi password lama.
- `DELETE /api/auth/me` menghapus akun sendiri setelah konfirmasi password.

`GET /api/config` mengirimkan URL grup WhatsApp dari konfigurasi backend tanpa
menanam tautan grup ke banyak file frontend. Respons autentikasi hanya memuat
nama, email, peran `user`, dan tanggal bergabung—tidak pernah `password_hash`.

### Deployment Vercel

Atur Vercel **Root Directory** ke root repository (bukan `frontend`). `vercel.json`
membangun `frontend/dist`, meneruskan `/api/*` ke Vercel Function di `api/`, dan
menyajikan aplikasi React untuk refresh `/login` dan `/dashboard`. Backend tidak
memerlukan server terpisah atau `app.listen()` di production.

Tambahkan `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`,
dan `JWT_SECRET` (minimal 32 karakter acak) pada Vercel Project Settings →
Environment Variables untuk Production. Tambahkan `WHATSAPP_GROUP_URL` bila
ingin mengubah tautan komunitas. `CORS_ORIGIN` hanya diperlukan untuk origin
frontend tambahan/custom; origin Vercel dikenali otomatis. Gunakan host dan port
SQL publik TiDB Cloud, bukan host lokal atau port SQL editor. TLS memverifikasi
sertifikat server; jangan menonaktifkannya untuk mengatasi error koneksi.
Jangan unggah atau commit file `.env`.

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
