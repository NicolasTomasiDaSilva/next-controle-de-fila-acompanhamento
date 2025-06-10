// types/statusEnum.ts
export enum StatusEnum {
  Aguardando = 1,
  Chamado = 2,
  Atendido = 3,
  Desistente = 4,
  Removido = 5,
  Ausente = 6,
}

export const StatusLabel: Record<StatusEnum, string> = {
  [StatusEnum.Aguardando]: "Aguardando",
  [StatusEnum.Chamado]: "Chamado",
  [StatusEnum.Atendido]: "Atendido",
  [StatusEnum.Desistente]: "Desistente",
  [StatusEnum.Removido]: "Removido",
  [StatusEnum.Ausente]: "Não Compareceu",
};

export const StatusMap: Record<
  StatusEnum,
  { label: string; className: string }
> = {
  [StatusEnum.Aguardando]: {
    label: "Aguardando",
    className: "bg-blue-100 text-blue-600 border border-blue-300",
  },
  [StatusEnum.Chamado]: {
    label: "Chamado",
    className: "bg-green-100 text-green-600 border border-green-300",
  },
  [StatusEnum.Atendido]: {
    label: "Atendido",
    className: "bg-sky-100 text-sky-600 border border-sky-300",
  },
  [StatusEnum.Desistente]: {
    label: "Desistente",
    className: "bg-yellow-100 text-yellow-600 border border-yellow-300",
  },
  [StatusEnum.Removido]: {
    label: "Removido",
    className: "bg-red-100 text-red-600 border border-red-300",
  },
  [StatusEnum.Ausente]: {
    label: "Não Compareceu",
    className: "bg-orange-100 text-orange-600 border border-orange-300",
  },
};
