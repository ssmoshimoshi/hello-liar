# Daftar Kritik & Kekurangan Sistem: *Hello Liar*

Dokumen ini dikhususkan sebagai inventaris jujur, tanpa filter, atas seluruh kekurangan, risiko kelemahan arsitektur, celah pengalaman pengguna, serta potensi salah langkah dalam pembangunan proyek ini. 
*(Berkas ini bersifat terbuka untuk ditambahkan atau dinilai kembali sewaktu-waktu oleh Anda Tanpa memuat pemecahan solusi—murni sebagai pemeta celah sistem).*

---

## 1. Ambiguitas Navigasi & Gesekan Kognitif (Layperson UI/UX)
- **Miskonsepsi Simbol `(+)`:** Simbol tambah di poros bawah layar secara naluri pengguna modern diasumsikan sebagai tombol *"Buat/Tulis Cerita Baru"*. Dijadikan sebagai tuas pembuka menu navigasi utama memicu kesalahan antisipasi tindakan pada interaksi pertama.
- **Ketiadaan Orientasi Spasial Langsung:** Pengguna awam yang melompati halaman (*Read, Gallery, Vault, Write*) tidak memiliki penanda judul halaman stasioner yang jelas di area baca utama, memicu kebingungan posisional di mana mereka sedang berada.

## 2. Beban Ekstrem Rendering & Overheat Hardware Ponsel
- **Ancaman Thermal Throttling di Halaman Write:** Animasi jaring akar hitam yang terus berjalan memforsir kalkulasi kanvas GPU peramban ponsel selular kelas tengah-ke-bawah, menyebabkan suhu baterai cepat panas pada durasi penulisan reflektif yang panjang.
- **Kebocoran Memori Dom pada Sesi Geser Panjang:** Pembuatan dan penghancuran node animasi berantai secara intensif berisiko melambatkan laju penyegeran peramban ponsel jika kartu cerita diusap (*swipe*) hingga puluhan atau ratusan kali tanpa jeda.

## 3. Kerentanan Amnesia Data & Ketiadaan Jaring Pengaman Teks
- **Kehancuran Teks Tanpa Peringatan:** Sistem sama sekali belum diperkuda oleh persistensi penyimpanan lokal sementara (*zero local auto-save cache*). Jika jempol tergelincir melakukan muat ulang (*swipe-down refresh*) atau peramban tertutup tiba-tiba, seluruh tulisan batin pengguna hancur tak berbekas.
- **Amnesia Jejak Onboarding:** Pilihan tag kategori dan status awal rentan tersapu bersih pada siklus penyegaran halaman biasa.

## 4. Penghalang Eksplorasi (Friction of Entry / Churn Risk)
- **Gerbang Mandatory Onboarding:** Mewajibkan pengguna baru memilih tag kategori sebelum diberikan hak akses melihat aliran cerita adalah dinding pembatas psikologis. Pengguna anonim berkarakter cepat bosan rentan langsung meninggalkan web (*bounce rate / churn*).
- **Over-Optimization pada Tingkat Klien Murni:** Terlalu banyak energi dihabiskan untuk mempermak mikro-interaksi klien statis sementara kedalaman aliran konten masih hampa.

## 5. Kekopongan Backend & Ilusi Kematangan Produk
- **Ketegasan Skala Backend Tertunda (Supabase):** Proyek ini telah mengunci arsitektur estetika lapis depan tingkat tinggi, namun pondasi server sejati (sinkronisasi otentikasi anonim ganda, proteksi injeksi anti-spam pada API pengiriman kebohongan, serta mitigasi moderasi konten sensitif) masih bersifat pasif. Hal ini menciptakan risiko perombakan besar di lapis UI kelak ketika komplikasi jaringan database nyata disuntikkan.
