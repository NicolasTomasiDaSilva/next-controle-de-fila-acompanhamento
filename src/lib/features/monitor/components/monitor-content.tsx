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
  const { configuracao } = useConfiguracao();
  const {
    ultimosChamados,
    handleEventoChamarClientes,
    handleEventoVoltarClientes,
  } = useFila();
  useSignalrFila({ handleEventoChamarClientes, handleEventoVoltarClientes });

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
      toast.success("Notificações sonoras ativadas.");
    } catch (err) {
      toast.error("Erro ao ativar notificações sonoras.");
    }
  }

  return (
    <>
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
    </>
  );
}
