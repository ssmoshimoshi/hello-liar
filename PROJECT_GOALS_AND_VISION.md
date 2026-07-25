# Visi & Tujuan Produk (Product Goals & Vision): *Hello Liar*

Dokumen ini disusun sebagai **Panduan Visi Utama (Product Requirements & Goals)** dari platform *Hello Liar*. Dokumen ini dirancang untuk diekspor dan dianalisis oleh entitas arsitek atau model AI eksternal guna membandingkan tujuan ideal dengan realitas kekurangan sistem saat ini.

---

## 1. Identitas Inti & Filosofi
**Slogan:** *"Everyone lies. Some write it down."*
**Konsep Produk:** *Hello Liar* adalah platform *micro-blogging* dan pengakuan dosa anonim (digital confessional). Tempat di mana pengguna dapat melepaskan beban psikologis terberat mereka melalui tulisan pendek yang dikemas sebagai sebuah "kebohongan". Platform ini bukan media sosial konvensional, melainkan ruang katarsis gelap yang mengutamakan privasi absolut dan beban emosional dari sebuah teks.

## 2. Tujuan Psikologis UI/UX (Cathartic Minimalism)
- **Minimalisme Mentah:** Estetika antarmuka tidak boleh terlihat seperti aplikasi *startup* komersial yang ceria. Desain harus terasa mentah, sinematik, dan sastrawi.
- **Batasan Warna Ketat:** Hanya menggunakan Hitam (*Pitch Black*), Putih (*Pure White*), dan spektrum Abu-abu. Warna **Living Coral (`#FC766AFF`)** adalah satu-satunya warna aksen yang diizinkan, digunakan eksklusif untuk menandakan interaksi vital atau resonansi emosional.
- **Tipografi Bersilangan:** Menggunakan font *serif* klasik (seperti *Playfair Display / Baskerville*) untuk bobot narasi cerita, dan font *sans-serif/mono* (seperti *Inter*) untuk elemen fungsional navigasi.
- **Micro-Interactions yang Bernyawa:** Sistem harus merespons sentuhan pengguna (klik, usap, tahan) dengan transisi pegas (*spring animations*) dan *haptic feedback* yang halus, memberi kesan bahwa aplikasi ini "hidup" dan menyerap emosi pengguna.

## 3. Arsitektur Interaksi Pengguna (User Flows)
1. **The Write Page (`/write`):** 
   - **Tujuan:** Ruang pelepasan rahasia. Layar kanvas kosong yang memisahkan diri dari sisa aplikasi. 
   - **Aturan Spasial:** Desain harus menjamin fokus 100% pada area pengetikan. Teks harus memiliki kontras sempurna (*Luminous Flat White*) di atas latar belakang transisional (Hitam/Coral). Terdapat perlindungan ergonomis agar tombol *LEPASKAN* tidak tumpang tindih dengan teks cerita sepanjang apa pun.
2. **The Swipe Feed (`/page.tsx` & `Read`):**
   - **Tujuan:** Penjelajahan cerita berbasis penggeseran (*swiping*). 
   - **Aturan Spasial:** Kartu cerita ditelusuri berdasarkan kategori (Uang, Keluarga, Asmara, Agama, dll). Navigasi harus sangat ramah ibu jari (*thumb-friendly*), menggunakan sistem grid rata tepi (*Edge Flush Architecture*) khusus untuk layar ponsel.
3. **Menu Navigasi Mengambang (`FloatingNav.tsx`):**
   - **Tujuan:** Kendali rute satu-tangan di bawah layar. Mengadopsi prinsip seimbang matematis; sayap kiri dan kanan menyebar ke tepi layar ponsel, sementara poros tombol tengah tetap tak tergoyahkan.

## 4. Tumpukan Teknologi (Tech Stack & Architecture)
- **Framework Utama:** Next.js (App Router), React 19, TypeScript.
- **Styling & Animasi:** Tailwind CSS v4 (Murni, tanpa *library UI wrapper* seperti Shadcn/Bootstrap demi kontrol absolut), Framer Motion.
- **Skalabilitas Internasional:** `next-intl` (Mendukung ID dan EN secara langsung).
- **Infrastruktur Backend (Target):** Supabase (Authentication Anonim, PostgreSQL, RLS Policies untuk proteksi spam dan moderasi teks, Edge Functions).

## 5. Parameter Kesuksesan (Success Metrics)
- **Zero Friction Entry:** Pengguna baru dapat langsung mengkonsumsi atau membuang cerita dalam waktu kurang dari 5 detik sejak memuat halaman tanpa registrasi yang mengganggu.
- **Performance Fidelity:** Animasi penggeseran dan kanvas *write* harus berjalan pada 60 FPS bahkan di perangkat ponsel Android kelas menengah ke bawah tanpa *thermal throttling*.
- **Device Agnostic Alignment:** Tampilan antarmuka harus mempertahankan logika kerapian dan patokan garis batas yang sama indahnya saat direntangkan dari layar ponsel vertikal hingga monitor monitor PC lebar.
