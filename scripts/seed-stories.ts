import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const generateId = () => crypto.randomUUID();

const stories = [
  // --- UANG (5) ---
  {
    content_id: 'Gaji pertamaku habis untuk membayar hutang pinjol ibuku. Aku bilang ke teman-teman aku membelikan hadiah untuknya. Sampai sekarang, aku makan mie instan setiap akhir bulan sambil tersenyum jika ada yang bertanya tentang ibuku.',
    content_en: 'My first salary went entirely to paying off my mother\'s online loan sharks. I told my friends I bought her a gift. Until now, I eat instant noodles every end of the month while smiling whenever someone asks about her.',
    categories: ['Uang', 'Keluarga'],
    length: 'medium'
  },
  {
    content_id: 'Aku selalu menolak ajakan nongkrong dengan alasan "sibuk ngerjain side project". Padahal saldo rekeningku tersisa Rp 14.500.',
    content_en: 'I always decline hangout invitations claiming I\'m "busy with a side project". In reality, my bank balance is exactly Rp 14,500.',
    categories: ['Uang', 'Pertemanan'],
    length: 'short'
  },
  {
    content_id: 'Tiga tahun berturut-turut aku pura-pura mudik. Aku menyewa kos murah di pinggiran kota selama seminggu penuh. Aku tidak punya uang untuk membelikan ponakan-ponakanku baju baru atau memberi amplop, dan aku tidak sanggup melihat tatapan merendahkan dari kakak iparku lagi.',
    content_en: 'For three years in a row, I pretended to go to my hometown for Eid. I rented a cheap room in the outskirts for a full week. I don\'t have money to buy new clothes or give envelopes to my nephews, and I can\'t bear to see my brother-in-law\'s condescending looks anymore.',
    categories: ['Uang', 'Keluarga'],
    length: 'long'
  },
  {
    content_id: 'Barang-barang branded yang kupakai ke kantor semuanya barang reject dari pasar loak.',
    content_en: 'All the branded items I wear to the office are rejects from the flea market.',
    categories: ['Uang', 'Karier'],
    length: 'short'
  },
  {
    content_id: 'Setiap kali pacarku membahas tentang menabung untuk pernikahan, aku mengalihkan pembicaraan. Dia tidak tahu kalau aku diam-diam mengirim separuh gajiku untuk membiayai pengobatan adikku yang kecanduan rehabilitasi, sebuah rahasia yang bahkan ibuku tidak tahu.',
    content_en: 'Every time my partner brings up saving for our wedding, I change the subject. They don\'t know that I secretly send half my salary to fund my sibling\'s rehab, a secret not even my mother knows.',
    categories: ['Uang', 'Pasangan', 'Keluarga'],
    length: 'medium'
  },

  // --- KELUARGA (5) ---
  {
    content_id: 'Aku menangis sejadi-jadinya di pemakaman ayahku. Bukan karena aku kehilangannya, tapi karena aku lega monster itu akhirnya pergi dari hidup kami. Orang-orang mengira aku anak yang paling berbakti.',
    content_en: 'I cried hysterically at my father\'s funeral. Not because I lost him, but because I was relieved that the monster was finally gone from our lives. People thought I was the most devoted child.',
    categories: ['Keluarga'],
    length: 'medium'
  },
  {
    content_id: 'Setiap hari raya, aku berharap ada yang menanyakan kabarku, bukan kapan aku menikah.',
    content_en: 'Every holiday, I hope someone asks how I am doing, not when I am getting married.',
    categories: ['Keluarga'],
    length: 'short'
  },
  {
    content_id: 'Di depan keluarga besar, kami adalah keluarga cemara yang sempurna. Ayah seorang pejabat, ibu aktif di kegiatan amal, dan aku lulusan universitas top. \n\nMereka tidak pernah tahu kalau setiap malam minggu piring-piring beterbangan di dapur, dan aku harus tidur di kamar mandi dengan earphone menyala maksimal agar tidak mendengar ibu memohon untuk tidak dipukul lagi. \n\nKeesokan paginya, kami pergi ke gereja bersama dengan senyum paling suci yang pernah kalian lihat.',
    content_en: 'In front of the extended family, we are the perfect, ideal family. Father is an official, mother is active in charities, and I graduated from a top university.\n\nThey never know that every Saturday night, plates fly in the kitchen, and I have to sleep in the bathroom with my earphones at max volume so I don\'t hear mother begging not to be hit again.\n\nThe next morning, we go to church together with the holiest smiles you have ever seen.',
    categories: ['Keluarga', 'Agama'],
    length: 'long'
  },
  {
    content_id: 'Aku yang diam-diam menaruh formulir pendaftaran panti jompo di meja kerja kakakku.',
    content_en: 'I was the one who secretly put the nursing home application form on my sibling\'s desk.',
    categories: ['Keluarga'],
    length: 'short'
  },
  {
    content_id: 'Ketika ibuku didiagnosis kanker, hal pertama yang terlintas di kepalaku bukan kesedihan, melainkan, "Berapa banyak uang yang harus kukeluarkan lagi?" Aku membenci diriku sendiri sejak detik itu.',
    content_en: 'When my mother was diagnosed with cancer, the first thing that crossed my mind wasn\'t sadness, but, "How much money do I have to spend now?" I\'ve hated myself since that exact second.',
    categories: ['Keluarga', 'Uang', 'Diri Sendiri'],
    length: 'medium'
  },

  // --- PASANGAN (5) ---
  {
    content_id: 'Aku selalu bilang aku tidak bisa tidur kalau dia tidak memelukku. Kenyataannya, aku begadang setiap malam untuk memastikan dia tidur lelap agar aku bisa memeriksa riwayat chatnya tanpa ketahuan.',
    content_en: 'I always say I can\'t sleep if he doesn\'t hug me. In reality, I stay awake every night to make sure he is fast asleep so I can check his chat history without getting caught.',
    categories: ['Pasangan', 'Overthinking'],
    length: 'medium'
  },
  {
    content_id: 'Cincin ini melingkar di jariku, tapi hatiku masih tertinggal di kedai kopi empat tahun yang lalu.',
    content_en: 'This ring is wrapped around my finger, but my heart is still left at that coffee shop four years ago.',
    categories: ['Pasangan'],
    length: 'short'
  },
  {
    content_id: 'Aku memaafkannya ketika dia ketahuan selingkuh pertama kali. Aku memaafkannya lagi pada kali kedua. Teman-temanku bilang aku berhati malaikat. \n\nMereka tidak tahu kalau aku bertahan bukan karena cinta, tapi karena aku memegang semua aset atas namaku. Aku sedang menyusun rencana selama setahun terakhir untuk memiskinkannya secara legal. \n\nBulan depan, saat dia berpikir kami akan merayakan anniversary, dia akan menerima surat gugatan cerai dan rekening yang benar-benar kosong.',
    content_en: 'I forgave him when he was caught cheating the first time. I forgave him again the second time. My friends say I have the heart of an angel.\n\nThey don\'t know that I\'m staying not out of love, but because I hold all the assets in my name. I\'ve been plotting for the last year to legally bankrupt him.\n\nNext month, when he thinks we are celebrating our anniversary, he will receive divorce papers and an absolutely empty bank account.',
    categories: ['Pasangan', 'Uang'],
    length: 'long'
  },
  {
    content_id: 'Aku tahu dia bukan jodohku, tapi aku terlalu takut untuk memulai dari awal dengan orang baru.',
    content_en: 'I know they are not my soulmate, but I\'m too scared to start all over again with someone new.',
    categories: ['Pasangan', 'Overthinking'],
    length: 'short'
  },
  {
    content_id: 'Aku memalsukan orgasme selama tiga tahun pernikahan kami. Bukan untuk menjaga perasaannya, tapi agar sesi itu cepat selesai dan aku bisa kembali menonton drakor di duniaku sendiri.',
    content_en: 'I faked orgasms for three years of our marriage. Not to protect his feelings, but so the session would end quickly and I could go back to watching kdramas in my own world.',
    categories: ['Pasangan'],
    length: 'medium'
  },

  // --- PERTEMANAN (5) ---
  {
    content_id: 'Di grup WhatsApp, aku yang paling berisik memberi semangat saat salah satu dari mereka kena PHK. Tapi di sudut hatiku, ada perasaan lega yang menjijikkan karena akhirnya bukan cuma aku yang merasa gagal.',
    content_en: 'In our WhatsApp group, I\'m the loudest one giving encouragement when one of them gets laid off. But in the corner of my heart, there is a disgusting sense of relief because finally, I\'m not the only one feeling like a failure.',
    categories: ['Pertemanan', 'Karier'],
    length: 'medium'
  },
  {
    content_id: 'Aku tidak membalas chatmu bukan karena sibuk, aku hanya sedang muak dengan eksistensimu.',
    content_en: 'I\'m not ignoring your chat because I\'m busy, I\'m just sick of your existence.',
    categories: ['Pertemanan', 'Ghosting'],
    length: 'short'
  },
  {
    content_id: 'Mereka memanggilku "The Therapist Friend". Setiap jam 2 pagi, aku mendengarkan curhatan mereka tentang patah hati, krisis karir, dan masalah keluarga. Mereka bilang aku pendengar terbaik di dunia. \n\nLucunya, tidak ada satupun dari mereka yang tahu kalau aku baru saja didiagnosis dengan depresi klinis akut. Kemarin, saat aku mencoba menceritakan jadwalku ke psikiater, temanku memotongnya dengan, "Eh, bentar deh, cowok yang kemarin nge-DM aku balas lagi nih!" \n\nSejak hari itu, aku memutuskan untuk membiarkan mereka berbicara, dan aku perlahan-lahan mati dalam keheningan.',
    content_en: 'They call me "The Therapist Friend". Every 2 AM, I listen to their rants about heartbreaks, career crises, and family issues. They say I\'m the best listener in the world.\n\nFunny thing is, none of them know that I was just diagnosed with severe clinical depression. Yesterday, when I tried to talk about my psychiatrist appointment, my friend cut me off with, "Wait a sec, that guy from yesterday just DM\'d me again!"\n\nSince that day, I decided to just let them talk, and I\'m slowly dying in silence.',
    categories: ['Pertemanan', 'Healing', 'Diri Sendiri'],
    length: 'long'
  },
  {
    content_id: 'Aku adalah orang yang menyebarkan rumor tentangmu waktu SMA agar aku bisa masuk ke circle anak populer.',
    content_en: 'I was the one who spread that rumor about you in high school so I could get into the popular kids\' circle.',
    categories: ['Pertemanan'],
    length: 'short'
  },
  {
    content_id: 'Setiap kali sahabatku menceritakan kebahagiaan pernikahannya, aku ikut tersenyum. Padahal aku tahu suaminya masih aktif mengirimiku pesan nakal setiap kali bertengkar dengannya.',
    content_en: 'Every time my best friend talks about her happy marriage, I smile along. Even though I know her husband still actively sends me naughty texts every time they have a fight.',
    categories: ['Pertemanan', 'Pasangan'],
    length: 'medium'
  },

  // --- KARIER (5) ---
  {
    content_id: 'Aku pura-pura tidak bisa menggunakan Excel tingkat lanjut. Jika kantorku tahu aku bisa membuat makro yang mengotomatisasi 80% pekerjaanku, mereka akan membebaniku dengan pekerjaan departemen lain tanpa tambahan gaji.',
    content_en: 'I pretend I don\'t know advanced Excel. If my office knew I could build macros that automate 80% of my work, they would dump other departments\' work on me with no extra pay.',
    categories: ['Karier'],
    length: 'medium'
  },
  {
    content_id: 'Gelar masternya kudapat dari membayar joki tesis. Sekarang aku menjadi dosen yang mengajari tentang integritas akademik.',
    content_en: 'I got my master\'s degree by paying a thesis writer. Now I\'m a lecturer teaching about academic integrity.',
    categories: ['Karier'],
    length: 'short'
  },
  {
    content_id: 'Selama pandemi, aku diam-diam bekerja untuk tiga perusahaan berbeda secara remote. Tiga laptop berjejer di mejaku. Jika ada meeting yang bersamaan, aku beralasan mikrofonku rusak atau sinyal internet mati. \n\nSekarang, ketika kebijakan WFO diterapkan kembali, aku memalsukan surat keterangan medis dari dokter bahwa aku mengalami kecemasan sosial parah yang memicu asma agar tetap bisa WFH. \n\nSistem ini rusak, jadi kenapa aku tidak memanfaatkannya sampai batas maksimal?',
    content_en: 'During the pandemic, I secretly worked for three different companies remotely. Three laptops lined up on my desk. If meetings overlapped, I claimed my mic was broken or the internet died.\n\nNow, as return-to-office mandates are enforced, I forged a medical certificate stating I have severe social anxiety that triggers asthma just so I can keep working from home.\n\nThe system is broken, so why shouldn\'t I exploit it to the absolute limit?',
    categories: ['Karier', 'Uang'],
    length: 'long'
  },
  {
    content_id: 'Aku yang tak sengaja menghapus database production tahun lalu. Sampai hari ini, mereka masih menyalahkan hacker Rusia.',
    content_en: 'I was the one who accidentally deleted the production database last year. To this day, they still blame Russian hackers.',
    categories: ['Karier'],
    length: 'short'
  },
  {
    content_id: 'Di LinkedIn aku menaruh kutipan inspirasional tentang kepemimpinan. Di grup anonim, aku merutuki atasanku yang toxic sambil mencari celah untuk melaporkannya ke HR atas pelecehan verbal.',
    content_en: 'On LinkedIn, I post inspirational quotes about leadership. In anonymous groups, I curse my toxic boss while looking for loopholes to report him to HR for verbal abuse.',
    categories: ['Karier', 'Diri Sendiri'],
    length: 'medium'
  },

  // --- DIRI SENDIRI (5) ---
  {
    content_id: 'Semua orang melihatku sebagai wanita independen yang kuat dan tidak butuh siapa-siapa. Sebenarnya, aku hanya terlalu trauma untuk membiarkan orang lain melihat seberapa rapuhnya diriku di balik pintu kamar.',
    content_en: 'Everyone sees me as a strong, independent woman who needs nobody. Truth is, I\'m just too traumatized to let anyone see how fragile I am behind my bedroom door.',
    categories: ['Diri Sendiri', 'Healing'],
    length: 'medium'
  },
  {
    content_id: 'Aku tidak suka diriku sendiri. Kalau aku orang lain, aku pasti sudah menjauhiku sejak lama.',
    content_en: 'I don\'t like myself. If I were someone else, I would have distanced myself from me a long time ago.',
    categories: ['Diri Sendiri', 'Overthinking'],
    length: 'short'
  },
  {
    content_id: 'Aku memanipulasi kepribadianku tergantung dengan siapa aku bicara. Di depan teman kuliah, aku si badut yang selalu ceria. Di depan bos, aku si kaku yang gila kerja. Di depan pacar, aku si manja yang butuh dilindungi. \n\nSemua itu berhasil. Orang-orang menyukaiku di setiap versinya. Tapi kemarin, saat aku duduk sendirian di kafe, aku benar-benar lupa bagaimana cara bereaksi tanpa audiens. Aku tidak tahu siapa aku yang sebenarnya. \n\nRasanya seperti memakai topeng terlalu lama sampai wajah aslimu meleleh menyatu dengannya.',
    content_en: 'I manipulate my personality depending on who I\'m talking to. In front of college friends, I\'m the cheerful clown. In front of the boss, I\'m the rigid workaholic. In front of my partner, I\'m the needy one who needs protection.\n\nIt works. People like me in every version. But yesterday, sitting alone in a cafe, I completely forgot how to react without an audience. I don\'t know who the real me is anymore.\n\nIt feels like wearing a mask for so long that your real face melts and merges with it.',
    categories: ['Diri Sendiri', 'Overthinking'],
    length: 'long'
  },
  {
    content_id: 'Aku sengaja menghentikan obat antidepresanku karena aku merindukan rasa sakit yang membuatku merasa hidup.',
    content_en: 'I intentionally stopped taking my antidepressants because I miss the pain that makes me feel alive.',
    categories: ['Diri Sendiri', 'Healing'],
    length: 'short'
  },
  {
    content_id: 'Setiap malam aku membuat skenario di kepalaku di mana aku mati secara tragis, hanya untuk membayangkan siapa saja yang akan datang dan menangis di pemakamanku.',
    content_en: 'Every night I create scenarios in my head where I die tragically, just to imagine who would come and cry at my funeral.',
    categories: ['Diri Sendiri', 'Overthinking'],
    length: 'medium'
  },

  // --- AGAMA (4) ---
  {
    content_id: 'Aku tetap memakai hijabku setiap keluar rumah. Bukan karena aku percaya pada Tuhan lagi, tapi karena ini satu-satunya cara mencegah ayahku kena serangan jantung.',
    content_en: 'I still wear my hijab every time I leave the house. Not because I believe in God anymore, but because it\'s the only way to prevent my father from having a heart attack.',
    categories: ['Agama', 'Keluarga'],
    length: 'medium'
  },
  {
    content_id: 'Tuhan yang mereka khotbahkan di mimbar itu terlalu kejam untuk kusembah.',
    content_en: 'The God they preach on that pulpit is too cruel for me to worship.',
    categories: ['Agama'],
    length: 'short'
  },
  {
    content_id: 'Aku menjadi panitia retret pemuda di gerejaku dan memimpin sesi doa yang membuat puluhan remaja menangis bertobat. \n\nMalam sebelumnya, aku tidur dengan salah satu pendeta muda di kamar hotel yang dibayar menggunakan uang persembahan gereja. \n\nHal yang paling menakutkan adalah, saat aku memimpin doa itu, aku sama sekali tidak merasakan rasa bersalah. Mungkin neraka memang kosong karena iblisnya ada di sini.',
    content_en: 'I became the committee head for my church\'s youth retreat and led a prayer session that made dozens of teenagers cry in repentance.\n\nThe night before, I slept with one of the young pastors in a hotel room paid for using the church\'s offering money.\n\nThe scariest part is, when I led that prayer, I felt absolutely zero guilt. Maybe hell is indeed empty because all the devils are here.',
    categories: ['Agama'],
    length: 'long'
  },
  {
    content_id: 'Aku berpuasa penuh sebulan bukan karena iman, tapi murni karena aku punya eating disorder dan ini alasan yang paling bisa diterima secara sosial.',
    content_en: 'I fast perfectly for a full month not out of faith, but purely because I have an eating disorder and this is the most socially acceptable excuse.',
    categories: ['Agama', 'Diri Sendiri'],
    length: 'medium'
  },

  // --- POLITIK (4) ---
  {
    content_id: 'Di media sosial aku berkoar-koar memboikot produk pro-Zionis dengan garang. Kenyataannya, aku masih diam-diam minum kopi dari brand itu setiap hari karena itu satu-satunya hal yang membuatku bisa bertahan di kantor.',
    content_en: 'On social media, I fiercely advocate boycotting pro-Zionist products. In reality, I still secretly drink coffee from that brand every day because it\'s the only thing that gets me through office hours.',
    categories: ['Politik', 'Diri Sendiri'],
    length: 'medium'
  },
  {
    content_id: 'Aku dibayar untuk menjadi buzzer kampanye kotor, menghancurkan reputasi kandidat bersih demi uang sewa kos.',
    content_en: 'I am paid to be a dirty campaign buzzer, destroying the reputation of a clean candidate just to pay my rent.',
    categories: ['Politik', 'Uang'],
    length: 'short'
  },
  {
    content_id: 'Aku adalah aktivis HAM kampus yang paling vokal. Aku memimpin demo, membakar ban, dan berorasi tentang keadilan sosial dan oligarki. \n\nSebulan sebelum wisuda, ayah tiriku yang merupakan pejabat tinggi kementerian menawarkan posisi komisaris di BUMN jalur belakang. Aku menerimanya tanpa ragu sedetik pun. \n\nSekarang, aku menyewa buzzer untuk meredam demo mahasiswa yang dipimpin oleh junior-juniorku sendiri. Idealisme rupanya mati saat kau ditawari gaji dua digit.',
    content_en: 'I was the most vocal campus human rights activist. I led protests, burned tires, and gave speeches about social justice and oligarchy.\n\nA month before graduation, my stepfather, a high-ranking ministry official, offered me a backdoor commissioner position at a state-owned enterprise. I accepted it without a second of hesitation.\n\nNow, I hire buzzers to suppress student protests led by my own juniors. Idealism apparently dies when you\'re offered a double-digit salary.',
    categories: ['Politik', 'Karier'],
    length: 'long'
  },
  {
    content_id: 'Aku benci obrolan politik. Tapi aku menghafal jargon-jargonnya hanya agar aku terlihat cerdas di depan rekan kerjaku.',
    content_en: 'I hate political talks. But I memorize the jargon just so I look smart in front of my coworkers.',
    categories: ['Politik', 'Pertemanan'],
    length: 'medium'
  },

  // --- HEALING (4) ---
  {
    content_id: 'Aku pergi retreat meditasi ke Bali selama dua minggu untuk menyembuhkan trauma masa kecilku. Yang kudapat hanyalah utang kartu kredit dan kesadaran bahwa aku memang pada dasarnya orang yang jahat.',
    content_en: 'I went on a two-week meditation retreat in Bali to heal my childhood trauma. All I got was credit card debt and the realization that I am fundamentally just a bad person.',
    categories: ['Healing', 'Uang'],
    length: 'medium'
  },
  {
    content_id: 'Quotes "healing" yang kuposting di Instagram sebenarnya kutujukan untuk menyindir mantanku.',
    content_en: 'The "healing" quotes I post on Instagram are actually directed to passive-aggressively mock my ex.',
    categories: ['Healing', 'Ghosting'],
    length: 'short'
  },
  {
    content_id: 'Orang bilang waktu akan menyembuhkan segalanya. Mereka salah. Waktu tidak menyembuhkan apa-apa. \n\nWaktu hanya membuatku lebih pintar menyembunyikan lukanya. Aku sudah membaca lima belas buku self-help, pergi ke tiga terapis berbeda, dan mencoba segala jenis jurnaling. \n\nKenyataannya, setiap kali aku melihat mobil merah yang mirip dengan miliknya, nafasku masih terhenti dan aku merasa seperti mati tercekik selama sepuluh detik penuh. Aku tidak healing, aku hanya berakting.',
    content_en: 'People say time heals everything. They are wrong. Time doesn\'t heal shit.\n\nTime only makes me smarter at hiding the wound. I\'ve read fifteen self-help books, went to three different therapists, and tried every kind of journaling.\n\nThe truth is, every time I see a red car similar to his, my breath still catches and I feel like I\'m choking to death for ten solid seconds. I am not healing, I am just acting.',
    categories: ['Healing', 'Pasangan'],
    length: 'long'
  },
  {
    content_id: 'Terapisku bilang aku sudah mengalami kemajuan pesat. Aku hanya sudah tahu jawaban apa yang ingin dia dengar agar sesi kami cepat selesai.',
    content_en: 'My therapist says I\'ve made tremendous progress. I just figured out what answers she wants to hear so our sessions end faster.',
    categories: ['Healing', 'Diri Sendiri'],
    length: 'medium'
  },

  // --- GHOSTING (4) ---
  {
    content_id: 'Aku meng-ghosting pria terbaik yang pernah kutemui karena dia memperlakukanku dengan sangat baik. Aku merasa muak. Tubuhku terlalu terbiasa dengan kekacauan dan laki-laki toxic.',
    content_en: 'I ghosted the best guy I ever met because he treated me so well. I felt sick to my stomach. My body is too accustomed to chaos and toxic men.',
    categories: ['Ghosting', 'Overthinking'],
    length: 'medium'
  },
  {
    content_id: 'Bukan sinyalku yang hilang, aku memang sengaja memblokir nomormu di tengah percakapan.',
    content_en: 'My signal didn\'t drop, I intentionally blocked your number mid-conversation.',
    categories: ['Ghosting'],
    length: 'short'
  },
  {
    content_id: 'Aku punya template alasan yang sudah kusiapkan di notes HP-ku untuk mengakhiri hubungan tanpa terlihat jahat. "Kamu terlalu baik buat aku," "Aku harus fokus karir," "Kesehatan mentalku lagi gak stabil."\n\nPadahal, aku menghilang hanya karena aku bosan. Begitu saja. Tidak ada alasan dramatis. Hari ini kamu menarik, besok kamu membosankan, dan aku tidak punya energi untuk memberikan penutupan (closure) pada mainan yang sudah tidak kumainkan.',
    content_en: 'I have a template of excuses ready in my phone notes to end relationships without looking like the bad guy. "You\'re too good for me," "I need to focus on my career," "My mental health is unstable."\n\nIn reality, I disappear simply because I get bored. Just like that. No dramatic reasons. Today you are interesting, tomorrow you are boring, and I don\'t have the energy to give closure to a toy I no longer play with.',
    categories: ['Ghosting', 'Pasangan'],
    length: 'long'
  },
  {
    content_id: 'Aku diam-diam membuat akun palsu untuk melihat Instagram story orang yang ku-ghosting dua tahun lalu, hanya untuk memastikan dia belum bahagia.',
    content_en: 'I secretly made a fake account to watch the Instagram stories of the person I ghosted two years ago, just to make sure they aren\'t happy yet.',
    categories: ['Ghosting', 'Diri Sendiri'],
    length: 'medium'
  },

  // --- OVERTHINKING (4) ---
  {
    content_id: 'Aku menghabiskan 45 menit menulis ulang sebuah email sederhana karena aku takut tanda seru di akhir kalimat akan membuatku terdengar agresif.',
    content_en: 'I spent 45 minutes rewriting a simple email because I was afraid the exclamation mark at the end would make me sound aggressive.',
    categories: ['Overthinking', 'Karier'],
    length: 'medium'
  },
  {
    content_id: 'Kalau aku mati besok, apakah riwayat pencarian browser-ku akan menghancurkan nama baik keluargaku?',
    content_en: 'If I die tomorrow, will my browser search history destroy my family\'s good name?',
    categories: ['Overthinking'],
    length: 'short'
  },
  {
    content_id: 'Setiap kali seseorang tertawa saat aku berjalan melewati mereka, aku langsung memindai seluruh ingatanku sejak aku bangun tidur. \n\nApakah bajuku terbalik? Apakah ada noda di celanaku? Apakah caraku berjalan aneh? Apakah mereka tahu rahasia yang kupendam? \n\nBahkan ketika aku sudah di rumah, mengunci pintu, dan berbaring di kasur, tawa itu masih terngiang, membongkar setiap lapis rasa percaya diriku sampai aku menangis tanpa alasan.',
    content_en: 'Every time someone laughs as I walk past them, I immediately scan my entire memory since I woke up.\n\nIs my shirt inside out? Is there a stain on my pants? Is my walk weird? Do they know the secret I\'m keeping?\n\nEven when I\'m already home, doors locked, lying in bed, that laugh still echoes, unraveling every layer of my self-confidence until I cry for no reason.',
    categories: ['Overthinking', 'Diri Sendiri'],
    length: 'long'
  },
  {
    content_id: 'Aku selalu bilang "maaf" untuk segala hal karena otakku meyakinkanku bahwa eksistensiku sendiri adalah sebuah kesalahan yang merepotkan orang lain.',
    content_en: 'I always say "sorry" for everything because my brain convinces me that my very existence is a mistake that inconveniences others.',
    categories: ['Overthinking', 'Diri Sendiri'],
    length: 'medium'
  }
];

async function seed() {
  console.log('Clearing existing stories...');
  // Delete all existing stories. Since we don't know the exact IDs, we can delete where id is not null.
  const { error: deleteError } = await supabase
    .from('lies')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes everything

  if (deleteError) {
    console.error('Error clearing data:', deleteError);
    return;
  }
  console.log('Database cleared.');

  console.log('Seeding 50 new stories...');
  
  const payload = stories.map(story => ({
    id: generateId(),
    content_id: story.content_id,
    content_en: story.content_en,
    doubt_count: Math.floor(Math.random() * 50),
    resonate_count: Math.floor(Math.random() * 100),
    illustrated: false,
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }));

  const { error: insertError } = await supabase
    .from('lies')
    .insert(payload);

  if (insertError) {
    console.error('Error inserting data:', insertError);
  } else {
    console.log('Successfully seeded 50 stories!');
  }
}

seed();
