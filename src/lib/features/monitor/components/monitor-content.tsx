"use client";

import { useConfiguracao } from "../hooks/use-configuracao";
import ChamadoAtual from "./chamado-atual";
import ChamadoRecentes from "./chamados-recentes";
import Header from "./header";

export default function MonitorContent() {
  const { configuracao } = useConfiguracao();

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: configuracao.corPrimaria,
        color: configuracao.corSobreposicao,
        backgroundImage:
          "radial-gradient(ellipse at center, rgb(0, 0, 0,0.3) 0%, transparent 100%)",
      }}
    >
      <Header />

      <div className="flex flex-row flex-1 gap-[max(2.5vh,2.5vw)] p-[max(2vh,2vw)] ">
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
