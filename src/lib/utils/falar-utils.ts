export async function falarNome(nome: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const audio = new Audio("/sounds/beep.mp3");

  // Aguarda o som tocar antes de falar
  await new Promise((resolve) => {
    audio.addEventListener("ended", resolve);
    audio.play();
  });

  const mensagem = new SpeechSynthesisUtterance(nome);
  mensagem.lang = "pt-BR";
  mensagem.rate = 1;
  mensagem.pitch = 1;
  mensagem.volume = 1;

  window.speechSynthesis.speak(mensagem);
}
