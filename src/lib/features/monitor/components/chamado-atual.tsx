import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function ChamadoAtual() {
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

      <Card className="flex-1 w-full rounded-[max(2vh,2vw)] flex flex-col justify-center items-center p-[max(2vh,2vw)] ">
        <p
          className="text-[max(5vh,5vw)]
      font-extrabold text-center leading-snug
    "
        >
          NICOLAS TOMASI DA SILVA SILVA SILVA
        </p>
      </Card>
    </div>
  );
}
