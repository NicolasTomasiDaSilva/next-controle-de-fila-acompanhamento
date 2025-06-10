import { useContext } from "react";
import { FilaContext } from "../context/fila-context";

export function useFila() {
  const context = useContext(FilaContext);
  if (context === undefined) {
    throw new Error("useFila must be used within a FilaProvider");
  }
  return context;
}
