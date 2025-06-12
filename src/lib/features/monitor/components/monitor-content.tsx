"use client";

import { useConfiguracao } from "../hooks/use-configuracao";
import { useFila } from "../hooks/use-fila";
import { useSignalrFila } from "../hooks/use-signalr-fila";
import ChamadoAtual from "./chamado-atual";

import Header from "./header";
import UltimosChamados from "./ultimos-chamados";

export default function MonitorContent() {
  const { configuracao } = useConfiguracao();
  const {
    ultimosChamados,
    handleEventoChamarClientes,
    handleEventoVoltarClientes,
  } = useFila();
  useSignalrFila({ handleEventoChamarClientes, handleEventoVoltarClientes });

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
          <ChamadoAtual ultimosChamados={ultimosChamados} />
        </div>
        <div className="w-1/2 ">
          <UltimosChamados ultimosChamados={ultimosChamados} />
        </div>
      </div>
    </div>
  );
}
