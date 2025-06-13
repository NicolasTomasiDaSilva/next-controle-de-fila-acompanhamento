export default function formatarHorario(data: unknown): string {
  const date = new Date(data as string | number | Date);

  if (isNaN(date.getTime())) return "--:--";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatarTempoEmMinutos(tempo: string): string {
  const partes = tempo.split(":");
  if (partes.length !== 3) return "";

  const minutos = parseInt(partes[1], 10);
  if (isNaN(minutos)) return "";

  return `${minutos} min`;
}
