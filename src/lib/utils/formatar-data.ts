export default function formatarData(date: Date): string {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const diaSemana = dias[date.getDay()];
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const hora = String(date.getHours()).padStart(2, "0");
  const minuto = String(date.getMinutes()).padStart(2, "0");

  return `${diaSemana}, ${dia}/${mes} ${hora}:${minuto}`;
}
