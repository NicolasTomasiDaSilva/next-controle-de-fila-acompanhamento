"use client";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useFila } from "../hooks/use-fila";

export default function ChamadoAtual() {
  const { ultimosClientesChamados } = useFila();

  return (
    <div className="h-full flex flex-col  justify-center items-center ">
      <div className="flex flex-row items-center gap-[max(1vh,1vw)] mb-[max(2vh,2vw)]">
        <Ticket className="h-[max(3vh,3vw)] w-[max(3vh,3vw)]" />
        <p
          className="text-[max(2vh,2vw)]
      font-extrabold whitespace-nowrap"
        >
          CHAMADO ATUAL
        </p>
      </div>

      <Card className="flex-1 w-full rounded-[max(2vh,2vw)] flex flex-col justify-center items-center p-[max(2vh,2vw)] shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none">
        {ultimosClientesChamados[0]?.nome && (
          <p
            className="text-[max(8vh,5vw)]
      font-extrabold text-center leading-snug
    "
          >
            {ultimosClientesChamados[0].nome.toUpperCase()}
          </p>
        )}
      </Card>
    </div>
  );
}
