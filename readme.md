# Praktikum Minggu 3 — Integrasi CSS Framework Bootstrap 5.3 & Komponen Interaktif

**Nama:** Grasia Gayatri Simanullang
**NIM:** 12S24027
**Kelas:** S1 Sistem Informasi — Institut Teknologi Del
**Mata Kuliah:** Pemrograman dan Pengujian Web (12S3101)

---

## Deskripsi

Proyek ini merupakan hasil refactoring dan peningkatan antarmuka web portofolio pribadi serta layanan
interaktif dari Minggu 2. Pada praktikum Minggu 3 ini, antarmuka diintegrasikan dengan CSS framework
**Bootstrap 5.3** untuk meningkatkan responsivitas, konsistensi visual, dan efisiensi pengembangan,
tanpa mengabaikan aspek aksesibilitas (WCAG 2.2) dan identitas visual personal.

---

## Fitur & Pembaruan Minggu 3

- **Responsive Navbar:** Komponen Bootstrap Navbar dengan tombol *toggler hamburger* dan warna gradien
  identitas personal (ungu), bukan `bg-dark` polos bawaan framework.
- **Hero & Profile Section:** Tampilan profil modern dengan badge status, badge peran, dan daftar
  keahlian menggunakan `<ul>`.
- **Grid Portofolio 4 Kartu:** Layout kartu proyek responsif
  (`row-cols-1 row-cols-md-2 row-cols-lg-4`) yang otomatis menyesuaikan ukuran layar.
- **Modal Dialog Interaktif:** 4 Bootstrap Modal dengan konten detail proyek yang berbeda-beda.
- **Formulir Layanan Modern:** Floating Labels (`.form-floating`), Input Groups berikon, `select`,
  radio, checkbox, dan validasi visual (`.invalid-feedback`) menggunakan `needs-validation`.
- **Custom CSS Theming:** 12 variabel CSS pada `:root`, palet warna ungu–amber (aturan 60-30-10),
  micro-interaction hover, dan advanced selectors (`:focus-within`, `:nth-child()`, `:is()`,
  child & adjacent sibling combinator) — **tanpa satu pun `!important`.**

---

## Tabel Komparasi: CSS Murni (Week 2) vs Bootstrap 5 (Week 3)

| Aspek                     | Week 2 (CSS Custom / Pure CSS)                          | Week 3 (Bootstrap 5 Integration)                                  |
| :------------------------ | :-------------------------------------------------------- | :------------------------------------------------------------------ |
| **Sistem Grid**           | Flexbox manual, breakpoint ditulis sendiri                | Grid 12-kolom Bootstrap (`row`, `col-*`) siap pakai & konsisten     |
| **Navigasi**               | Tidak ada navbar responsif                                 | Navbar `sticky-top` dengan toggle hamburger otomatis di mobile      |
| **Komponen UI**           | Kartu profil statis, tanpa modal                           | Card, Badge, dan Modal Bootstrap yang interaktif                    |
| **Formulir**               | `<input>` polos dengan CSS custom manual                   | Floating Labels, Input Group berikon, validasi visual Bootstrap     |
| **Custom CSS & Theming**  | 6 variabel CSS, palet biru dasar                            | 12 variabel CSS, palet ungu–amber personal, advanced selectors      |
| **Waktu Pengembangan**    | Lebih lama karena semua style ditulis manual                | Lebih cepat karena banyak utility class siap pakai dari Bootstrap   |
| **Ukuran Berkas CSS**     | Ringan (hanya kode sendiri)                                 | Lebih besar (tambahan library Bootstrap via CDN)                     |

---

## Struktur Berkas

```
├── index.html   → Struktur HTML5 semantik + komponen Bootstrap 5
├── style.css    → Custom CSS override (variabel, tema, animasi, responsif)
└── README.md    → Dokumentasi proyek
```

---

## Cara Menjalankan

1. Clone repositori ini.
2. Buka `index.html` langsung di browser, atau gunakan ekstensi **Live Server** di VS Code.
3. Pastikan koneksi internet aktif untuk memuat Bootstrap 5.3 CDN, Bootstrap Icons, dan Google Fonts.

---

## Live Demo

- **Repositori GitHub:** `https://github.com/[username]/ppw2026-week3-12S24027`
- **GitHub Pages:** `https://[username].github.io/ppw2026-week3-12S24027/`

*(Ganti tautan di atas dengan repositori dan URL GitHub Pages milikmu setelah deployment.)*

---

## Checklist Pemenuhan Tugas

- [x] Integrasi Bootstrap 5.3 CDN (CSS & JS bundle) + Bootstrap Icons
- [x] Navbar sticky-top dengan brand identity & toggle hamburger berfungsi
- [x] Hero Section proporsional dengan CTA
- [x] Minimal 4 kartu proyek dalam grid responsif, terhubung ke 4 modal berbeda
- [x] Formulir dengan Floating Labels, Input Group, Select, Checkbox, dan validasi visual
- [x] Minimal 6 variabel CSS pada `:root` (total 12), palet warna personal, zero `!important`
- [ ] Branch `week3-bootstrap` dibuat & di-push ke GitHub
- [ ] GitHub Pages diaktifkan & tidak error 404
- [ ] Screenshot before/after ditambahkan ke README

---

*Modul Praktikum disusun oleh Chandro Pardede, S.Kom., M.Sc. — Mata Kuliah Pemrograman dan Pengujian
Aplikasi Web (12S3101), Institut Teknologi Del.*