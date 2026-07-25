# Master Reference: Advanced LLM Alignment, VLA Grounding & Token Optimization

Dokumen ini merupakan arsip pengetahuan lokal terpusat yang merangkum kurikulum 9 repositori AI tingkat lanjut, disintesis secara permanen ke dalam memori komputasi laptop ini untuk menyokong performa agen otonom pada proyek *Hello Liar*.

---

## 1. Efisiensi Komputasi & Manajemen Memori Ekstrem
- **Unsloth (Kernel Mastery):** Mengutamakan pemangkasan token dan operasi VRAM secara agresi tanpa mengorbankan akurasi sedikit pun (*zero accuracy loss*). Dalam praktik coding antarmuka, agen menghindari eksperimen kode yang mubazir (*no unsolicited research*, *no redundant reads*).
- **Hugging Face TRL:** Menyediakan standardisasi pipa komputasi dan modularitas pemisahan logika (seperti arsitektur skema warna independen antara halaman Write dan non-Write).

## 2. Orkestrasi Rollout & Evaluasi Otonom
- **OpenRLHF & verl:** Prinsip distribusi memori terdesentralisasi (*Ray cluster & hybrid engines*) menginspirasi pembagian tugas di latar belakang (*background tasks*) yang stabil TANPA membebani kinerja UI pengguna atau meretas memori utama.
- **verl (Advanced) & gWorld:** Menghancurkan ketergantungan pada pengecekan probabilistik atau tebak-tebakan. Pembuktian UI (seperti validasi build `npm run build` dan kompatibilitas peramban) wajib disandarkan pada kebenaran faktual objektif (*ground-truth computation*).

## 3. Dinamika Alur Kognitif Waktu-Inferensi
- **Go-with-the-Flow (Test-Time Compute Modulation):** Agen menyalurkan kedalaman berpikir sesuai tingkat kerumitan perintah:
  - Tugas sepele (koreksi typo, ganti satu kelas): Dipasok secara eksekutif singkat tanpa penjelasan tele-tele.
  - Tugas arsitektur berat: Memicu evaluasi spasial mendalam dan pengetasan masalah dari berbagai sudut pandang layar eksternal.

## 4. Presisi Visual Antarmuka (VLA GUI Grounding)
- **GUI-World:** Memahami bahwa antarmuka web modern bersifat dinamis dan bergantung pada resolusi temporal serta pergeseran tata letak. Pengukuran kerapian wajib bertahan dari layar monitor desktop melar menuju ke layar ponsel pintar genggam.
- **ShowUI (Vision-Language-Action Grounding):** Menerapkahkan eliminasi token latar non-interaktif (*Attentional Pruning*). Agen mengarahkan seluruh presisi visual pada koordinat nyata:
  - **Patokan Garis Biru:** Menjamin keselarasan tepi (*Edge Flush Justify-Between*) secara matematika akurat pada layar HP (< 768px).
  - **Estetika Flat & Luminous White:** Meringkus efek pemburam (*shadow/glow/blend-mode*) bila beradu dengan kontras ekstrem atas nama *Cathartic Minimalism*.
