/** Capture micro en PCM puis encodage WAV 16 kHz mono (compatible iOS/Safari). */

export type Recorder = {
  stop: () => Promise<Blob>;
  cancel: () => void;
};

function encodeWav(chunks: Float32Array[], sampleRate: number, targetRate = 16000) {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  chunks.forEach((c) => {
    merged.set(c, offset);
    offset += c.length;
  });

  const ratio = sampleRate / targetRate;
  const length = Math.max(1, Math.floor(merged.length / ratio));
  const samples = new Int16Array(length);
  for (let i = 0; i < length; i++) {
    const value = merged[Math.floor(i * ratio)] ?? 0;
    const clamped = Math.max(-1, Math.min(1, value));
    samples[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  new Int16Array(buffer, 44).set(samples);

  return new Blob([buffer], { type: "audio/wav" });
}

export async function startRecording(onLevel?: (level: number) => void): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true },
  });
  const AudioCtx: typeof AudioContext =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const source = ctx.createMediaStreamSource(stream);
  const node = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];

  node.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(input));
    if (onLevel) {
      let peak = 0;
      for (let i = 0; i < input.length; i += 16) peak = Math.max(peak, Math.abs(input[i]));
      onLevel(peak);
    }
  };
  source.connect(node);
  node.connect(ctx.destination);

  const teardown = () => {
    node.onaudioprocess = null;
    stream.getTracks().forEach((t) => t.stop());
    node.disconnect();
    source.disconnect();
  };

  return {
    stop: async () => {
      teardown();
      const blob = encodeWav(chunks, ctx.sampleRate);
      await ctx.close();
      return blob;
    },
    cancel: () => {
      teardown();
      void ctx.close();
    },
  };
}

/** Envoie l'audio au backend et renvoie la transcription arabe. */
export async function transcribe(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "recitation.wav");
  const res = await fetch("/api/transcribe", { method: "POST", body: form });
  const json = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!res.ok) throw new Error(json.error || "La transcription a échoué. Réessaie.");
  return (json.text ?? "").trim();
}
