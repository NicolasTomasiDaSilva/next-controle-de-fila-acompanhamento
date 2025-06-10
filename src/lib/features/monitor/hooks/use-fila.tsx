import { useContext, useMemo } from "react";
import { FilaContext } from "../context/fila-context";
import { StatusEnum } from "@/lib/enums/status-enum";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }
  const { fila, setFila } = context;

  console.log("aqui", fila.clientes);
  console.log("aqui", fila.clientes);
  console.log("aqui", fila.clientes);
  console.log("aqui", fila.clientes);

  const ultimosClientesChamados = useMemo(() => {
    if (!fila?.clientes) return [];
    return fila.clientes
      .filter(
        (cliente) =>
          cliente.status === StatusEnum.Chamado ||
          cliente.status === StatusEnum.Atendido
      )
      .sort(
        (a, b) =>
          new Date(b.dataHoraChamada!).getTime() -
          new Date(a.dataHoraChamada!).getTime()
      );
  }, [fila]);

  return {
    fila,
    setFila,
    ultimosClientesChamados,
  };
}
