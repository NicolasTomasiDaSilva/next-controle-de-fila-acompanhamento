import { useContext } from "react";
import { SomContext } from "../contexts/som-context";

export function useSom() {
  const context = useContext(SomContext);
  if (!context)
    throw new Error("useSomContext must be used within SomProvider");
  return context;
}
