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

export default function MonitorContent() {
  const [audioLiberado, setAudioLiberado] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);
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

  useEffect(() => {
    // Abre o dialog imediatamente
    if (!audioLiberado) {
      setMostrarDialog(true);

      // Fecha automaticamente após 10 segundos
      const timeout = setTimeout(() => {
        setMostrarDialog(false);
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [audioLiberado]);

  function liberarSom() {
    try {
      setAudioLiberado(true);
      setMostrarDialog(false);

      const utterance = new SpeechSynthesisUtterance(
        "Notificações sonoras ativadas."
      );
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      toast.error("Erro ao ativar notificações sonoras.");
    }
  }

  return (
    <div
      className="flex-1 flex flex-col  justify-center "
      style={{ fontSize: "min(2vh, 1vw)" }}
    >
      <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deseja ativar notificações sonoras?</DialogTitle>
            <DialogDescription>
              Isso permitirá que os chamados sejam anunciados com som e voz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"azul"} onClick={liberarSom}>
              Permitir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
