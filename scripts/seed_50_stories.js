const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const stories = [
  { en: "I pretend to be happy so they leave me alone.", id: "Saya pura-pura bahagia agar mereka membiarkan saya sendiri." },
  { en: "I deleted all their pictures but I still remember.", id: "Saya menghapus semua foto mereka tapi saya masih ingat." },
  { en: "I laugh at my own jokes because no one else does.", id: "Saya menertawakan lelucon saya sendiri karena tidak ada orang lain yang melakukannya." },
  { en: "I told them I was busy, but I was just staring at the ceiling.", id: "Saya bilang saya sibuk, padahal saya hanya menatap langit-langit." },
  { en: "I smile when I'm angry so I don't look crazy.", id: "Saya tersenyum saat marah agar tidak terlihat gila." },
  { en: "I practice conversations I'll never have.", id: "Saya berlatih percakapan yang tidak akan pernah saya lakukan." },
  { en: "I say 'I'm fine' because explaining is too exhausting.", id: "Saya bilang 'Saya baik-baik saja' karena menjelaskannya terlalu melelahkan." },
  { en: "I keep secrets that aren't even mine.", id: "Saya menyimpan rahasia yang bahkan bukan milik saya." },
  { en: "I don't miss them, I just miss the illusion of them.", id: "Saya tidak merindukan mereka, saya hanya merindukan ilusi tentang mereka." },
  { en: "I lie about what time I went to sleep to seem normal.", id: "Saya berbohong tentang jam berapa saya tidur agar terlihat normal." },
  { en: "I hope my texts don't get replies so I can stay isolated.", id: "Saya harap pesan saya tidak dibalas agar saya bisa tetap menyendiri." },
  { en: "I forgive people because I'm too tired to be mad.", id: "Saya memaafkan orang karena saya terlalu lelah untuk marah." },
  { en: "I buy things to feel something, but the feeling fades.", id: "Saya membeli barang untuk merasakan sesuatu, tapi perasaannya memudar." },
  { en: "I say 'maybe' when I definitely mean 'no'.", id: "Saya bilang 'mungkin' padahal maksud saya pasti 'tidak'." },
  { en: "I am terrified of being perceived.", id: "Saya sangat takut diperhatikan." },
  { en: "I act dumb so people don't expect much from me.", id: "Saya bertingkah bodoh agar orang tidak berharap banyak dari saya." },
  { en: "I listen to sad music to force myself to cry.", id: "Saya mendengarkan musik sedih untuk memaksa diri saya menangis." },
  { en: "I haven't been honest with my therapist in months.", id: "Saya belum jujur dengan terapis saya selama berbulan-bulan." },
  { en: "I wait for the weekend just to waste it.", id: "Saya menunggu akhir pekan hanya untuk menyia-nyiakannya." },
  { en: "I pretend to check my phone when I feel awkward.", id: "Saya pura-pura mengecek HP saat merasa canggung." },
  { en: "I overthink things until they become problems.", id: "Saya memikirkan hal-hal secara berlebihan sampai menjadi masalah." },
  { en: "I say 'I forgot' when I actively chose to ignore it.", id: "Saya bilang 'saya lupa' padahal saya sengaja mengabaikannya." },
  { en: "I am jealous of people who can sleep instantly.", id: "Saya iri pada orang yang bisa langsung tidur." },
  { en: "I construct fake scenarios to hurt my own feelings.", id: "Saya membangun skenario palsu untuk menyakiti perasaan saya sendiri." },
  { en: "I push people away to see if they'll stay.", id: "Saya menjauhkan orang untuk melihat apakah mereka akan bertahan." },
  { en: "I smile in the mirror to see if it looks convincing.", id: "Saya tersenyum di depan cermin untuk melihat apakah itu meyakinkan." },
  { en: "I read messages from the notification bar so I don't have to reply.", id: "Saya membaca pesan dari bilah notifikasi agar saya tidak perlu membalas." },
  { en: "I wear headphones with no music playing.", id: "Saya memakai earphone tanpa menyalakan musik." },
  { en: "I say 'it is what it is' when it's actually tearing me apart.", id: "Saya bilang 'ya sudahlah' padahal itu benar-benar menghancurkan saya." },
  { en: "I am deeply afraid of becoming exactly like my parents.", id: "Saya sangat takut menjadi sama persis seperti orang tua saya." },
  { en: "I agree with opinions I hate just to avoid conflict.", id: "Saya setuju dengan pendapat yang saya benci hanya untuk menghindari konflik." },
  { en: "I lie about my hobbies to sound interesting.", id: "Saya berbohong tentang hobi saya agar terdengar menarik." },
  { en: "I hold onto anger because it feels safer than sadness.", id: "Saya menahan kemarahan karena rasanya lebih aman daripada kesedihan." },
  { en: "I pretend to understand jokes so I'm not left out.", id: "Saya pura-pura mengerti lelucon agar tidak ketinggalan." },
  { en: "I am secretly relieved when plans get canceled.", id: "Saya diam-diam lega saat rencana dibatalkan." },
  { en: "I stay up late because it's the only time nobody needs me.", id: "Saya begadang karena itu satu-satunya waktu tidak ada yang membutuhkan saya." },
  { en: "I apologize when I bump into inanimate objects.", id: "Saya meminta maaf saat menabrak benda mati." },
  { en: "I laugh loudly so nobody asks if I'm okay.", id: "Saya tertawa keras agar tidak ada yang bertanya apakah saya baik-baik saja." },
  { en: "I hoard digital files because I'm afraid to let go.", id: "Saya menimbun file digital karena saya takut melepaskannya." },
  { en: "I invent reasons to be mad at them so moving on is easier.", id: "Saya mengarang alasan untuk marah pada mereka agar lebih mudah *move on*." },
  { en: "I stare blankly at screens to pause reality.", id: "Saya menatap kosong ke layar untuk menjeda kenyataan." },
  { en: "I claim to be tired when I'm actually just sad.", id: "Saya mengaku lelah padahal sebenarnya saya hanya sedih." },
  { en: "I mirror people's personalities so they like me.", id: "Saya meniru kepribadian orang agar mereka menyukai saya." },
  { en: "I say I hate drama, but I actively watch it unfold.", id: "Saya bilang saya benci drama, tapi saya aktif menontonnya terjadi." },
  { en: "I keep typing and deleting the same message.", id: "Saya terus mengetik dan menghapus pesan yang sama." },
  { en: "I act like I don't care because caring hurts too much.", id: "Saya bertingkah seperti tidak peduli karena peduli itu terlalu menyakitkan." },
  { en: "I take the long route home just to be alone longer.", id: "Saya mengambil jalan memutar pulang hanya agar bisa menyendiri lebih lama." },
  { en: "I say 'I'm almost there' when I haven't even left.", id: "Saya bilang 'saya hampir sampai' padahal saya belum berangkat." },
  { en: "I pretend not to see someone so I don't have to say hi.", id: "Saya pura-pura tidak melihat seseorang agar saya tidak perlu menyapa." },
  { en: "I write these things down knowing it won't fix me.", id: "Saya menuliskan hal-hal ini meski tahu ini tidak akan memperbaiki saya." }
];

async function seed() {
  console.log("Wiping existing lies...");
  const { error: deleteError } = await supabase.from('lies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
    console.error("Error deleting:", deleteError);
  } else {
    console.log("Successfully wiped.");
  }

  console.log("Inserting 50 new stories...");
  const records = stories.map((s, i) => {
    const resonate = Math.floor(Math.random() * 50);
    const doubt = Math.floor(Math.random() * 20);
    const isIllustrated = Math.random() > 0.9;
    
    return {
      content_id: s.id,
      content_en: s.en,
      resonate_count: resonate,
      doubt_count: doubt,
      illustrated: isIllustrated,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
    };
  });

  const { error: insertError } = await supabase.from('lies').insert(records);
  
  if (insertError) {
    console.error("Error inserting:", insertError);
  } else {
    console.log("Successfully inserted 50 stories!");
  }
}

seed();
