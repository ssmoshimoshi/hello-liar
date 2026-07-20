export type Lie = {
  id: string;
  content_id: string;
  content_en: string;
  doubt_count: number;
  created_at: string;
};

// Initial Mock Data
let lies: Lie[] = [
  {
    id: "1",
    content_id: "Saya selalu bilang ke orang tua saya kalau saya sudah bayar uang semesteran dari tabungan sendiri, padahal sebenarnya uang itu saya pakai untuk liburan ke Bali sama teman-teman.",
    content_en: "I always tell my parents that I paid my tuition fees from my own savings, but in reality, I used that money for a trip to Bali with my friends.",
    doubt_count: 5,
    created_at: new Date(Date.now() - 100000000).toISOString()
  },
  {
    id: "2",
    content_id: "Aku pernah pura-pura sakit tifus selama dua minggu penuh hanya supaya tidak perlu ikut acara kumpul keluarga besar yang super canggung dan ditanya-tanya soal pernikahan.",
    content_en: "I once faked having typhus for two whole weeks just so I wouldn't have to attend a super awkward big family gathering and be asked about marriage.",
    doubt_count: 35,
    created_at: new Date(Date.now() - 50000000).toISOString()
  },
  {
    id: "3",
    content_id: "Waktu SMA, nilai ulanganku hancur berantakan. Aku menyusup ke ruang guru waktu jam istirahat dan mengganti nilaiku sendiri di buku absen guru. Sampai lulus tidak ada yang tahu.",
    content_en: "During high school, my exam grades were a complete mess. I sneaked into the teachers' room during break and changed my own grades in the attendance book. No one knew until I graduated.",
    doubt_count: 60, // Above max threshold
    created_at: new Date(Date.now() - 10000000).toISOString()
  }
];

export async function getLies(): Promise<Lie[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return lies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getLieById(id: string): Promise<Lie | undefined> {
  return lies.find(lie => lie.id === id);
}

export async function addLie(content_id: string, content_en: string): Promise<Lie> {
  const newLie: Lie = {
    id: Math.random().toString(36).substring(2, 9),
    content_id,
    content_en,
    doubt_count: 0,
    created_at: new Date().toISOString()
  };
  lies.push(newLie);
  return newLie;
}

export async function incrementDoubt(id: string): Promise<number | null> {
  const lie = lies.find(l => l.id === id);
  if (lie) {
    lie.doubt_count += 1;
    return lie.doubt_count;
  }
  return null;
}
