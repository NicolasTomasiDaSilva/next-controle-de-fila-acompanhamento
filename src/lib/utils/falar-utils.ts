export async function falarNome(nome: string) {
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
