"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SomContextType {
  audioLiberado: boolean;
  mostrarDialog: boolean;
  setMostrarDialog: (v: boolean) => void;
  liberarSom: () => void;
  emitirSom: (som: string) => Promise<void>;
  chamarNome: (nome: string) => Promise<void>;
}

export const SomContext = createContext<SomContextType | undefined>(undefined);

export function SomProvider({ children }: { children: ReactNode }) {
  const [audioLiberado, setAudioLiberado] = useState<boolean>(false);
  const [mostrarDialog, setMostrarDialog] = useState<boolean>(false);

  const filaDeSons = useRef<string[]>([]);
  const tocando = useRef<boolean>(false);

  function tocarAudioCompleto(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);

      const canPlayHandler = () => {
        audio.removeEventListener("canplaythrough", canPlayHandler);

        audio.play().catch(reject);

        audio.addEventListener("ended", () => {
          resolve();
        });
      };

      audio.addEventListener("canplaythrough", canPlayHandler);

      audio.addEventListener("error", (e) => {
        audio.removeEventListener("canplaythrough", canPlayHandler);
        reject(e);
      });

      audio.load();
    });
  }

  async function emitirSom(som: string) {
    filaDeSons.current.push(som);

    if (tocando.current) return;

    tocando.current = true;

    while (filaDeSons.current.length > 0) {
      const proximoSom = filaDeSons.current.shift()!;
      try {
        await tocarAudioCompleto(`/sounds/${proximoSom}.mp3`);
      } catch {
        // Ignora erros para não travar fila
      }
    }

    tocando.current = false;
  }

  async function chamarNome(nome: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Toca beep esperando carregar e terminar
    await tocarAudioCompleto("/sounds/beep.mp3");

    // Fala o nome aguardando o fim da fala
    await new Promise<void>((resolve) => {
      const mensagem = new SpeechSynthesisUtterance(nome);
      mensagem.lang = "pt-BR";
      mensagem.rate = 1;
      mensagem.pitch = 1;
      mensagem.volume = 1;

      mensagem.onend = () => resolve();
      mensagem.onerror = () => resolve();

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

  return (
    <SomContext.Provider
      value={{
        audioLiberado,
        mostrarDialog,
        setMostrarDialog,
        liberarSom,
        emitirSom,
        chamarNome,
      }}
    >
      {children}
    </SomContext.Provider>
  );
}
