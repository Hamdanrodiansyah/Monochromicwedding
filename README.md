# Monochrome Wedding — starter project

Starter awal untuk template undangan digital monokrom yang orisinal.

## Menjalankan project
1. Ekstrak folder project.
2. Buka `index.html` di browser untuk mencoba tampilan dasar.
3. Untuk pengujian yang lebih konsisten, jalankan melalui local development server (misalnya Live Server di VS Code).
4. Coba personalisasi nama tamu dengan URL:
   - `index.html?to=Hamdan`
   - `index.html?to=Hamdan%20Rodiansyah`

## Mengubah data pasangan
Edit objek di `js/wedding-data.js`:
- `groomName`
- `brideName`
- `dateISO`
- `dateLabel`
- `dateLongLabel`

## Struktur
- `index.html`: sampul
- `invitation.html`: halaman utama sementara
- `css/cover.css`: gaya sampul
- `css/invitation.css`: gaya halaman utama
- `js/cover.js`: nama tamu dan transisi
- `js/invitation.js`: data tampilan halaman utama
- `js/wedding-data.js`: data bersama

Catatan: foto pasangan, detail acara asli, RSVP, musik, dan konfigurasi hosting belum ditambahkan. Placeholder pada halaman utama memang disediakan untuk kita rancang bersama pada tahap berikutnya.
