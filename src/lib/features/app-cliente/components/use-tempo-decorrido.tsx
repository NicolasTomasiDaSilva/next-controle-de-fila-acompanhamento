import { calcularTempoDecorridoEmMinutos } from "@/lib/utils/formatar-horario";
import { useState, useEffect } from "react";

export function useTempoDecorrido(dataInicio: Date) {
  const [minutos, setMinutos] = useState<string>("0");

  useEffect(() => {
    function atualizar() {
      setMinutos(calcularTempoDecorridoEmMinutos(dataInicio));
    }

    atualizar();
    const intervalo = setInterval(atualizar, 30000);
    return () => clearInterval(intervalo);
  }, [dataInicio]);

  return minutos;
}
