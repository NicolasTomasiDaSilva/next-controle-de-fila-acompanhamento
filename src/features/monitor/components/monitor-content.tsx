"use client";

import { useEffect, useState } from "react";
import { useConfiguracao } from "../hooks/use-configuracao";
import { useFila } from "../hooks/use-fila";
import { useSignalrFila } from "../hooks/use-signalr-fila";
import ChamadoAtual from "./chamado-atual";

import Header from "./header";
import UltimosChamados from "./ultimos-chamados";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSom } from "../../shared/hooks/use-som";
import AtivarNotificacoesSonorasDialog from "../../shared/components/ativar-notificacoes-sonoras-dialog";

export default function MonitorContent() {
  const { configuracao, handleEventoAtualizarConfiguracao } = useConfiguracao();
  const {
    ultimosChamados,
    handleEventoChamarClientes,
    handleEventoVoltarClientes,
  } = useFila();
  useSignalrFila({
    handleEventoChamarClientes,
    handleEventoVoltarClientes,
    handleEventoAtualizarConfiguracao,
  });

  return (
    <div
      className="flex-1 flex flex-col  justify-center "
      style={{ fontSize: "min(2vh, 1vw)" }}
    >
      <AtivarNotificacoesSonorasDialog
        descricao={
          "Isso permitirá que os chamados sejam anunciados com som e voz."
        }
      />

      <div
        className="flex-1 flex flex-col h-full"
        style={{
          backgroundColor: configuracao.corPrimaria,
          color: configuracao.corSobreposicao,
        }}
      >
        <Header />
        <div className="w-full flex flex-row flex-1 gap-[1.5em] py-[2em] px-[2em] pt-[1em]">
          <div className="w-1/2 overflow-hidden">
            <ChamadoAtual ultimosChamados={ultimosChamados} />
          </div>
          <div className="w-1/2 overflow-hidden">
            <UltimosChamados ultimosChamados={ultimosChamados} />
          </div>
        </div>
      </div>
    </div>
  );
}
