import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const stories = [
  // REGRET
  {
    content_id: "Kalau aku mati besok, apakah riwayat pencarian browser-ku akan menghancurkan nama baik keluargaku?",
    content_en: "If I die tomorrow, will my browser search history destroy my family's good name?"
  },
  {
    content_id: "Aku pura-pura tidak tahu bahwa ayah memiliki keluarga lain. Demi ibu yang sudah tua.",
    content_en: "I pretend not to know that my father has another family. For the sake of my aging mother."
  },
  {
    content_id: "Setiap ulang tahunnya, aku selalu mengirim bunga anonim. Padahal dia sudah bahagia dengan orang lain.",
    content_en: "Every year on her birthday, I send anonymous flowers. Even though she's already happy with someone else."
  },
  {
    content_id: "Uang kuliah adikku kugunakan untuk trading crypto, dan semuanya habis dalam semalam.",
    content_en: "I used my little brother's tuition money for crypto trading, and lost it all in one night."
  },
  {
    content_id: "Aku adalah alasan sahabatku putus dengan tunangannya lima tahun yang lalu.",
    content_en: "I am the reason my best friend broke up with her fiancé five years ago."
  },
  {
    content_id: "Di depan umum aku aktivis hewan, tapi diam-diam aku tidak bisa hidup tanpa makan daging anjing saat di kampung.",
    content_en: "In public I'm an animal activist, but secretly I can't live without eating dog meat when I visit my hometown."
  },
  {
    content_id: "Aku tidak pernah menangis saat pemakaman nenek, bukan karena aku kuat, tapi karena aku lega dia akhirnya pergi.",
    content_en: "I didn't cry at my grandmother's funeral. Not because I'm strong, but because I was relieved she was finally gone."
  },
  {
    content_id: "Aku mencuri ide proposal teman kantorku, dan itu membuatku naik jabatan bulan lalu.",
    content_en: "I stole my coworker's proposal idea, and it got me promoted last month."
  },
  {
    content_id: "Sebenarnya aku tidak tuli nada, aku hanya malas ikut paduan suara gereja.",
    content_en: "I'm not actually tone-deaf, I'm just too lazy to join the church choir."
  },
  {
    content_id: "Semua puisi sedih yang kutulis dan memenangkan penghargaan itu bukan tentang mantan, tapi tentang kucingku yang hilang.",
    content_en: "All those sad award-winning poems I wrote aren't about my ex, they're about my missing cat."
  },
  
  // DARK SECRETS
  {
    content_id: "Aku menukar hasil tes DNA anak perempuanku. Suamiku tidak boleh tahu bahwa itu bukan anaknya.",
    content_en: "I swapped my daughter's DNA test results. My husband must never know she isn't his."
  },
  {
    content_id: "Setiap malam jumat, aku pergi ke panti asuhan hanya untuk merasa diriku bukan monster yang sebenarnya.",
    content_en: "Every Friday night, I go to the orphanage just to convince myself I'm not the monster I truly am."
  },
  {
    content_id: "Aku membiarkan anjing tetanggaku lepas dan tertabrak, karena dia tidak berhenti menggonggong selama sebulan.",
    content_en: "I let my neighbor's dog out and it got hit by a car, because it wouldn't stop barking for a month."
  },
  {
    content_id: "Orang tuaku bangga aku lulus cumlaude. Mereka tidak tahu aku menyuap dosen pembimbingku.",
    content_en: "My parents are proud I graduated cum laude. They don't know I bribed my thesis advisor."
  },
  {
    content_id: "Aku masih menyimpan kunci apartemen mantanku, dan kadang aku masuk saat dia sedang kerja.",
    content_en: "I still keep my ex's apartment key, and sometimes I go in when he's at work."
  },
  {
    content_id: "Anakku mengira ayahnya pahlawan yang gugur. Sebenarnya dia di penjara seumur hidup.",
    content_en: "My child thinks their father is a fallen hero. In reality, he's serving a life sentence."
  },
  {
    content_id: "Aku sering mematikan alat bantu dengar ibuku agar aku tidak perlu mendengarkan keluhannya.",
    content_en: "I often turn off my mother's hearing aid so I don't have to listen to her complaints."
  },
  {
    content_id: "Sebagian besar uang donasi yayasan yatim piatu ini kugunakan untuk membayar hutang pinjol.",
    content_en: "Most of this orphanage's donation money goes toward paying off my online loan debts."
  },
  {
    content_id: "Aku adalah orang yang melaporkan bisnis ilegal kakakku ke polisi demi warisan keluarga.",
    content_en: "I'm the one who reported my brother's illegal business to the police for the family inheritance."
  },
  {
    content_id: "Setiap kali aku memasak untuk mertuaku, aku selalu memasukkan bahan makanan yang paling ia benci dalam bentuk bubuk.",
    content_en: "Every time I cook for my mother-in-law, I sneak in the ingredients she hates most in powdered form."
  },

  // WHITE LIES
  {
    content_id: "Aku selalu memuji masakan pacarku enak. Padahal aku selalu mampir ke McDonald's sebelum menemuinya.",
    content_en: "I always praise my girlfriend's cooking. Even though I always stop by McDonald's before seeing her."
  },
  {
    content_id: "Ibu, aku baik-baik saja di perantauan. Maaf aku berbohong, aku baru saja dipecat hari ini.",
    content_en: "Mom, I'm doing fine living far away. I'm sorry I lied, I just got fired today."
  },
  {
    content_id: "Aku bilang ponselku rusak agar tidak perlu membalas pesan bos di akhir pekan.",
    content_en: "I said my phone was broken so I wouldn't have to reply to my boss's messages on the weekend."
  },
  {
    content_id: "Setiap dia bertanya apakah dia terlihat gemuk, aku selalu bilang tidak. Kebohongan yang menyelamatkan dunia.",
    content_en: "Every time she asks if she looks fat, I always say no. The lie that saves the world."
  },
  {
    content_id: "Aku bilang padanya aku tertidur lelap. Padahal aku menangis semalaman di kamar mandi.",
    content_en: "I told him I was sleeping soundly. When I was actually crying all night in the bathroom."
  },
  {
    content_id: "Aku mengaku alergi makanan laut karena aku terlalu miskin untuk ikut makan malam di restoran mewah itu.",
    content_en: "I claimed to be allergic to seafood because I was too broke to join that fancy restaurant dinner."
  },
  {
    content_id: "Anak anjing kita tidak dikirim ke peternakan, Nak. Maafkan ayah.",
    content_en: "Our puppy wasn't sent to a farm, son. Forgive me."
  },
  {
    content_id: "Aku mengedit nilai IPK-ku di transkrip fotokopian agar ayahku bisa tersenyum sebelum ia meninggal.",
    content_en: "I photoshopped my GPA on the printed transcript so my dad could smile before he passed away."
  },
  {
    content_id: "Tentu, aku mengingat namamu! (Aku tidak ingat sama sekali, siapa kau?)",
    content_en: "Of course I remember your name! (I don't remember at all, who are you?)"
  },
  {
    content_id: "Aku bilang koneksi internetku buruk saat Zoom meeting, padahal aku sedang bermain game.",
    content_en: "I said my internet connection was bad during the Zoom meeting, but I was actually playing a game."
  },

  // VOID / EMPTINESS
  {
    content_id: "Terkadang aku berharap dunia berakhir hari ini, jadi aku tidak perlu berangkat kerja besok.",
    content_en: "Sometimes I hope the world ends today, so I don't have to go to work tomorrow."
  },
  {
    content_id: "Aku punya ratusan teman di Instagram, tapi tak satupun yang bisa kuhubungi saat aku ingin mengakhiri hidupku.",
    content_en: "I have hundreds of friends on Instagram, but no one to call when I want to end my life."
  },
  {
    content_id: "Aku menatap langit-langit kamar ini selama tiga jam setiap malam, menunggu sesuatu terjadi. Tidak pernah ada.",
    content_en: "I stare at this bedroom ceiling for three hours every night, waiting for something to happen. Nothing ever does."
  },
  {
    content_id: "Senyumku di foto keluarga itu adalah karya seni akting terbaikku sepanjang masa.",
    content_en: "My smile in that family portrait is my greatest acting masterpiece of all time."
  },
  {
    content_id: "Semua orang mengira aku mandiri. Aku hanya terlalu takut diabaikan jika aku meminta tolong.",
    content_en: "Everyone thinks I'm independent. I'm just too afraid of being ignored if I ask for help."
  },
  {
    content_id: "Aku menghabiskan uang untuk terapi, padahal yang kubutuhkan hanya satu pelukan tulus.",
    content_en: "I spend money on therapy, when all I really need is one genuine hug."
  },
  {
    content_id: "Kadang aku duduk di stasiun kereta tanpa tiket, hanya membayangkan kemana orang-orang itu pergi.",
    content_en: "Sometimes I sit at the train station without a ticket, just imagining where all those people are going."
  },
  {
    content_id: "Aku menghapus pesan yang sudah kutulis panjang karena aku sadar, tidak ada yang peduli.",
    content_en: "I delete long messages I've already typed out because I realize, nobody cares."
  },
  {
    content_id: "Di usiaku yang ke-30, aku menyadari bahwa aku tidak hidup, aku hanya bertahan dari hari ke hari.",
    content_en: "At 30, I realized that I'm not living, I'm just surviving day to day."
  },
  {
    content_id: "Tidak ada yang salah dengan hidupku. Lalu kenapa aku merasa sangat kosong?",
    content_en: "There's nothing wrong with my life. So why do I feel so incredibly empty?"
  },

  // MISCELLANEOUS / EXISTENTIAL
  {
    content_id: "Aku berpura-pura sangat sibuk di depan komputer agar manajer tidak memberiku lebih banyak pekerjaan.",
    content_en: "I pretend to be super busy in front of my computer so the manager doesn't give me more work."
  },
  {
    content_id: "Aku membuat akun palsu untuk mem-bully diriku sendiri agar teman-temanku bersimpati padaku.",
    content_en: "I made a fake account to cyberbully myself so my friends would sympathize with me."
  },
  {
    content_id: "Satu-satunya alasanku belum bunuh diri adalah karena aku khawatir siapa yang akan memberi makan kucing jalanan di depan rumah.",
    content_en: "The only reason I haven't killed myself is because I worry who will feed the stray cat in front of my house."
  },
  {
    content_id: "Aku membuang semua surat dari ibumu, Sayang. Dia tidak pernah membencimu, aku yang membuatnya seolah begitu.",
    content_en: "I threw away all the letters from your mother, Honey. She never hated you, I just made it seem that way."
  },
  {
    content_id: "Setiap bangun tidur, kebohongan pertamaku adalah: 'Hari ini akan lebih baik'.",
    content_en: "Every time I wake up, my first lie is: 'Today will be better'."
  },
  {
    content_id: "Aku menyalahkan hantu atas barang-barang yang hilang di rumah. Padahal aku penderita kleptomania.",
    content_en: "I blame ghosts for the missing items in the house. But I'm actually a kleptomaniac."
  },
  {
    content_id: "Aku pernah sengaja merusak ban mobilnya agar dia terlambat ke bandara, hanya agar dia membatalkan pindah kota.",
    content_en: "I once purposefully slashed his tire so he'd be late for the airport, just so he'd cancel moving away."
  },
  {
    content_id: "Saya pendeta di gereja ini. Rahasia terdalam saya: Saya sudah tidak percaya Tuhan sejak sepuluh tahun lalu.",
    content_en: "I am the pastor of this church. My deepest secret: I stopped believing in God ten years ago."
  },
  {
    content_id: "Aku bilang kepadanya aku sudah move on. Nyatanya aku membuat kloning suaranya menggunakan AI untuk menemaniku tidur.",
    content_en: "I told him I moved on. The truth is I cloned his voice using AI to keep me company as I sleep."
  },
  {
    content_id: "Aku tidak pernah memaafkanmu. Aku hanya lelah marah.",
    content_en: "I never forgave you. I'm just tired of being angry."
  }
];

async function seed() {
  console.log(`Starting to seed ${stories.length} stories...`);
  
  // Clear existing
  const { error: delError } = await supabase.from('lies').delete().neq('content_id', 'dummy');
  if (delError) {
    console.error("Failed to delete old data:", delError);
    return;
  }
  console.log("Successfully wiped old database.");

  // Insert sequentially to avoid rate limit or payload issues
  let count = 0;
  for (const story of stories) {
    const { error } = await supabase.from('lies').insert([story]);
    if (error) {
      console.error("Error inserting story:", error);
    } else {
      count++;
    }
  }

  console.log(`Successfully seeded ${count}/${stories.length} stories.`);
}

seed();
