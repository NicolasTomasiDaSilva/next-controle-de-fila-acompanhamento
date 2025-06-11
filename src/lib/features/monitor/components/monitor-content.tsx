"use client";

import { useConfiguracao } from "../hooks/use-configuracao";
import { useSignalrFila } from "../hooks/use-signalr-fila";
import ChamadoAtual from "./chamado-atual";
import ChamadoRecentes from "./chamados-recentes";
import Header from "./header";

export default function MonitorContent() {
  const { configuracao } = useConfiguracao();
  useSignalrFila();

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: configuracao.corPrimaria,
        color: configuracao.corSobreposicao,
      }}
    >
      <Header />

      <div className="flex flex-row flex-1 gap-[max(2.5vh,2.5vw)] py-[max(1vh,1vw)] px-[max(2.5vh,2.5vw)] ">
        <div className="w-1/2 ">
          <ChamadoAtual />
        </div>
        <div className="w-1/2 ">
          <ChamadoRecentes />
        </div>
      </div>
    </div>
  );
}
