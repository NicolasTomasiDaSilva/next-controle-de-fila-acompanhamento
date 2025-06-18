import { useEffect, useState } from "react";
import { toast } from "sonner";

type TipoEvento = "subiu" | "desceu" | "chamado" | "removido";

export function useSom() {
  const [audioLiberado, setAudioLiberado] = useState<boolean>(false);
  const [mostrarDialog, setMostrarDialog] = useState<boolean>(false);

  async function emitirSom(som: string) {
    if (typeof window === "undefined") return;

    const audio = new Audio(`/sounds/${som}.mp3`);

    await new Promise<void>((resolve) => {
      audio.addEventListener("ended", () => resolve());
      audio.play();
    });
  }
  async function chamarNome(nome: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const audio = new Audio("/sounds/beep.mp3");

    // Espera o beep tocar
    await new Promise((resolve) => {
      audio.addEventListener("ended", resolve);
      audio.play();
    });

    // Cria promise para o speechSynthesis
    await new Promise<void>((resolve) => {
      const mensagem = new SpeechSynthesisUtterance(nome);
      mensagem.lang = "pt-BR";
      mensagem.rate = 1;
      mensagem.pitch = 1;
      mensagem.volume = 1;

      mensagem.onend = () => resolve();
      mensagem.onerror = () => resolve(); // evita travar em erro

      window.speechSynthesis.speak(mensagem);
    });
  }

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
    setAudioLiberado(true);
    setMostrarDialog(false);
  }

  return {
    audioLiberado,
    mostrarDialog,
    setMostrarDialog,
    liberarSom,
    emitirSom,
    chamarNome,
  };
}
