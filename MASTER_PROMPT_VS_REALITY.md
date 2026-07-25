# Evaluasi Kritis: Master Prompt vs. Realitas Proyek Saat Ini

Dokumen ini membedah penyimpangan fatal antara visi murni dari *Master Prompt* awal Anda dengan wujud aplikasi web *Hello Liar* yang terbangun saat ini.

---

## 1. Pelanggaran Arsitektur Ekstrim (The Technical Drift)
| Parameter | Visi Master Prompt | Realitas Proyek Saat Ini (Pelanggaran) |
| :--- | :--- | :--- |
| **Framework** | React 19 + Vite + React Router v6 | Next.js App Router (Penyimpangan fatal yang memicu over-engineering) |
| **Styling** | Vanilla CSS. **Haram pakai Tailwind.** | Tailwind CSS v4 digunakan secara masif di seluruh sistem. |
| **Tipografi** | `"Courier New"` eksklusif di seluruh titik. Haram pakai sans-serif. | Memakai `Inter` (sans-serif modern) dan `Playfair Display` (sangat komersial/SaaS). |
| **Animasi** | API Canvas Murni (Fisika partikel kehancuran). | Framer Motion (Transisi *spring* dan penggeseran UI modern). |

## 2. Pelanggaran Psikologis UI/UX (The Identity Betrayal)
Visi awal *Hello Liar* adalah **instalasi seni psikologis brutal**. Namun AI/pengembangan sebelumnya telah mengubahnya menjadi aplikasi yang terasa seperti platform startup modern.
- **Dosa Navigasi:** Master prompt secara eksplisit melarang (*Haram*) adanya *Navigation bar* atau menu melayang. Namun, proyek saat ini justru memiliki menu melayang `FloatingNav.tsx` dengan ikon `(+)` dan opsi rute.
- **Dosa Fitur (Feature Creep):** Master prompt hanya mengizinkan 3 rute mentah (`/`, `/confess`, `/discover`) dalam bentuk *Galaxy Constellation* dan *Particle Canvas*. Realitasnya saat ini adalah arsitektur *Swipe Feed* ala Tinder/TikTok dan layar *Category Onboarding* yang cerewet.
- **Dosa Warna:** Visi murni menuntut latar belakang `#000000` mutlak. Proyek saat ini memasukkan elemen gradasi abu-abu, *mesh/jaring hitam*, dan transisi latar yang menghilangkan nuansa "Void" hampa.

## 3. Kesimpulan Arsitektural (Brutal Honesty)
Anda **benar-benar telah salah langkah**, dan firasat Anda terbukti akurat 100%. 

Agen AI sebelumnya (atau evolusi kode yang terjadi) telah **mengabaikan "SECTION 8: ABSOLUTE NON-NEGOTIABLES" secara total**. Alih-alih membangun ruang pengakuan dosa brutal dan sunyi seperti yang tertulis di Master Prompt, kode saat ini adalah Frankenstein dari standar industri (*boilerplate* Next.js, Tailwind, menu navigasi, font Inter) yang justru menghancurkan paradoks psikologis dari *Hello Liar*.

Terdapat dua jalan dari sini:
1. **The Purge (Kembali ke Nol):** Memusnahkan `src/` Next.js saat ini dan membangun ulang murni dengan React+Vite+Canvas+Vanilla CSS sesuai kitab *Master Prompt*.
2. **The Compromise:** Mempertahankan Next.js, namun memenggal habis Tailwind, Floating Nav, dan Font Inter, untuk dikembalikan ke estetika *Courier New* brutalist.
