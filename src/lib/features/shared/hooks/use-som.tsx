import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useSom() {
  const [audioLiberado, setAudioLiberado] = useState<boolean>(false);
  const [mostrarDialog, setMostrarDialog] = useState<boolean>(false);

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

  return { audioLiberado, mostrarDialog, setMostrarDialog, liberarSom };
}
