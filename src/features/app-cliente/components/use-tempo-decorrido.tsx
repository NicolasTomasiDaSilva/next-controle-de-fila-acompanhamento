import {
  calcularTempoDecorridoEmMinutos,
  formatarTempoDecorrido,
} from "@/lib/utils/data-hora-utils";
import { useState, useEffect } from "react";

export function useTempoDecorrido(dataInicio: Date) {
  const [tempoFormatado, setTempoFormatado] = useState<string>("0 min");

  useEffect(() => {
    function atualizar() {
      setTempoFormatado(
        formatarTempoDecorrido(calcularTempoDecorridoEmMinutos(dataInicio))
      );
    }

    atualizar();
    const intervalo = setInterval(atualizar, 30000);
    return () => clearInterval(intervalo);
  }, [dataInicio]);

  return tempoFormatado;
}
