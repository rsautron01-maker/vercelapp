/** Récitateurs disponibles (audio api.alquran.cloud / cdn.islamic.network). */
export type Reciter = { id: string; name: string; style?: string };

export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "Mishary Al-Afasy" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit", style: "Murattal" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais" },
  { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.husarymujawwad", name: "Al-Husary", style: "Mujawwad" },
  { id: "ar.minshawi", name: "Al-Minshawi" },
  { id: "ar.minshawimujawwad", name: "Al-Minshawi", style: "Mujawwad" },
  { id: "ar.shaatree", name: "Abu Bakr Ash-Shaatree" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel" },
  { id: "ar.ahmedajamy", name: "Ahmed Al-Ajamy" },
  { id: "ar.abdullahbasfar", name: "Abdullah Basfar" },
  { id: "ar.saoodshuraym", name: "Saood Ash-Shuraym" },
  { id: "ar.aymanswoaid", name: "Ayman Sowaid", style: "pédagogique" },
];

export const DEFAULT_RECITER = "ar.alafasy";

export function reciterLabel(id: string) {
  const reciter = RECITERS.find((r) => r.id === id);
  if (!reciter) return id;
  return reciter.style ? `${reciter.name} (${reciter.style})` : reciter.name;
}

/** Audio d'un verset (numéro global 1 → 6236). */
export function ayahAudioUrl(globalNumber: number, reciter: string) {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalNumber}.mp3`;
}

/** Audio de la sourate complète. */
export function surahAudioUrl(surah: number, reciter: string) {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surah}.mp3`;
}
