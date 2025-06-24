export function formatarData(date: Date): string {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const diaSemana = dias[date.getDay()];
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const hora = String(date.getHours()).padStart(2, "0");
  const minuto = String(date.getMinutes()).padStart(2, "0");

  return `${diaSemana}, ${dia}/${mes} ${hora}:${minuto}`;
}

export function formatarHorario(data: unknown): string {
  const date = new Date(data as string | number | Date);

  if (isNaN(date.getTime())) return "--:--";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function calcularIntervaloTempoEmMinutos(tempo: string): number {
  const [horasStr, minutosStr, segundosStr] = tempo.split(":");

  const horas = Number(horasStr);
  const minutos = Number(minutosStr);
  const segundos = Number(segundosStr);

  const totalMinutos = horas * 60 + minutos + segundos / 60;

  return Math.floor(totalMinutos);
}

export function calcularTempoDecorridoEmMinutos(dataInicio: Date): number {
  const agora = new Date();
  const diferencaMs = agora.getTime() - dataInicio.getTime();
  const minutos = Math.floor(diferencaMs / 1000 / 60);

  return minutos;
}

export function formatarTempoDecorrido(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas > 0 && minutosRestantes > 0) {
    return `${horas} h ${minutosRestantes} min`;
  } else if (horas > 0) {
    return `${horas} h`;
  } else {
    return `${minutosRestantes} min`;
  }
}
