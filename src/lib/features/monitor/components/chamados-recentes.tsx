import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import formatarHorario from "@/lib/utils/formatar-horario";
import hexToRgba from "@/lib/utils/hext-to-rgba";
import { ArrowRight, CircleCheck, Ticket } from "lucide-react";
import { useConfiguracao } from "../hooks/useConfiguracao";

export default function ChamadoAtual() {
  const { configuracao } = useConfiguracao();

  const ultimosChamados = [
    { nome: "NICOLAS TOMASI DA SILVA SILVA", dataHoraChamada: new Date() },
    { nome: "NICOLAS TOMASI DA SILVA SILVA", dataHoraChamada: new Date() },
    { nome: "NICOLAS TOMASI DA SILVA SILVA", dataHoraChamada: new Date() },
    { nome: "NICOLAS TOMASI DA SILVA SILVA", dataHoraChamada: new Date() },
  ];
  return (
    <div className="  h-full flex flex-col  justify-center items-center">
      <div className="flex flex-row items-center gap-[max(1vh,1vw)] mb-[max(2vh,2vw)]">
        <CircleCheck className="h-[max(3vh,3vw)] w-[max(3vh,3vw)]" />
        <p
          className="text-[max(2vh,2vw)]
      font-extrabold whitespace-nowrap
 "
        >
          ÚLTIMOS CHAMADOS
        </p>
      </div>

      <Card
        className="flex-1 w-full rounded-[max(2vh,2vw)] bg-black/5 border-none items-start justify-around p-[max(2vh,2vw)] text-inherit gap-0 space-y-0 px-0 py-0"
        style={{
          backgroundColor: hexToRgba(configuracao.corPrimaria, 0.3),
        }}
      >
        {ultimosChamados.map((cliente, index) => (
          <>
            <div className="w-fullh-[max(7vh,7vw)]  flex flex-row items-center  gap-[max(1vh,1vw)] px-[max(2vh,2vw)]  py-[max(1vh,1vw)] ">
              <p className="font-bold text-[max(3vh,3vw)] ">
                {formatarHorario(cliente.dataHoraChamada)}
              </p>
              <ArrowRight
                className="h-[max(2.5vh,2.5vw)] w-[max(2.5vh,2.5vw)]"
                style={{ color: hexToRgba(configuracao.corPrimaria, 1) }}
              />
              <p className="text-[max(2.5vh,2.5vw)] font-semibold line-clamp-2  leading-none">
                {cliente.nome}
              </p>
            </div>
            {index !== ultimosChamados.length - 1 && (
              <Separator
                style={{ backgroundColor: configuracao.corPrimaria }}
              />
            )}
          </>
        ))}
      </Card>
    </div>
  );
}
