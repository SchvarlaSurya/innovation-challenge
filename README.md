# SitaanKu — Sistem Manajemen Sitaan & Kebersihan

Platform digital untuk Divisi Kebersihan OSIS dalam mengelola **barang sitaan** dan **penilaian kebersihan kelas**.

## Fitur

- **Manajemen Sitaan**: Catat barang sitaan per kelas, otomatis hitung peringatan vs denda
- **Sistem Denda**: Peringatan pertama = ⚠️ tanpa denda, kedua onward = 🔴 Rp5.000/item
- **Konfirmasi Pengambilan**: Admin konfirmasi pengambilan setelah denda dibayar
- **Leaderboard Kebersihan**: Skor per kelas ditampilkan transparan ke seluruh siswa
- **Autentikasi**: Halaman admin dilindungi login (Supabase Auth)

## Teknologi

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## Persiapan Lokal

1. Buat project Supabase di [supabase.com](https://supabase.com)

2. Salin file `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

3. Isi kredensial di `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Jalankan migrasi database:

- Buka Supabase Dashboard → SQL Editor
- Salin isi file `supabase/migrations/0001_init_schema.sql`
- Jalankan

Ini akan membuat:
- Semua tabel (`classes`, `confiscated_items`, `class_warnings`, `cleanliness_scores`)
- RLS policies (public read, authenticated write)
- Storage bucket `confiscated-item-photos` dengan polinya
- 10 kelas contoh + beberapa data sitaan & skor

5. Buat akun admin:

- Buka halaman `/login` di browser
- Buat akun melalui Supabase Dashboard → Authentication → Users → Add User
- Atau langsung daftar via form login (`/login`)

6. Instal dependencies & jalankan development server:

```bash
npm install
npm run dev
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000)

## Struktur Proyek

```
├── app/                         # Next.js App Router
│   ├── admin/                   # Halaman admin (terlindungi middleware)
│   │   ├── page.tsx             # Dashboard
│   │   ├── sitean/              # Manajemen sitaan
│   │   ├── nilai/               # Input nilai kebersihan
│   │   └── laporan/             # Statistik & chart
│   ├── kelas/[id]/              # Detail kelas (publik)
│   ├── leaderboard/             # Peringkat kebersihan (publik)
│   ├── login/                   # Halaman login OSIS
│   ├── loading.tsx              # Skeleton loading
│   ├── error.tsx                # Error boundary
│   └── not-found.tsx            # Custom 404
├── components/
│   ├── admin/                   # Komponen khusus admin
│   └── ui/                      # Komponen reusable
├── lib/
│   ├── supabase-client.ts       # Browser client + auth
│   ├── supabase-server.ts       # Server-side admin client
│   └── queries.ts               # Supabase query helpers
├── types/                       # TypeScript type definitions
├── utils/                       # Helpers & business logic
├── supabase/
│   └── migrations/              # SQL migration files
└── middleware.ts                # Route protection
```

## Deployment ke Vercel

1. Push ke repository GitHub
2. Di Vercel, import project
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy

## Warna Status

| Status | Warna | Keterangan |
|--------|-------|------------|
| ⚠️ Warning | `#eab308` (kuning) | Pelanggaran pertama, belum kena denda |
| 🔴 Denda | `#ef4444` (merah) | Sudah ada riwayat pelanggaran |
| ✅ Selesai | `#22c55e` (hijau) | Barang sudah diambil, denda lunas |
