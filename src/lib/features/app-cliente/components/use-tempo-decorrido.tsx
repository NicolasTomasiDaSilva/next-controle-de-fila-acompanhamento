import { useState, useEffect } from "react";

export function useTempoDecorrido(dataInicio: Date) {
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    const entrada = new Date(dataInicio);

    function atualizar() {
      const agora = new Date();
      const diffMs = agora.getTime() - entrada.getTime();
      const diffMin = Math.floor(diffMs / 1000 / 60);
      setMinutos(diffMin >= 0 ? diffMin : 0);
    }

    atualizar();
    const intervalo = setInterval(atualizar, 30000);
    return () => clearInterval(intervalo);
  }, [dataInicio]);

  return minutos;
}
