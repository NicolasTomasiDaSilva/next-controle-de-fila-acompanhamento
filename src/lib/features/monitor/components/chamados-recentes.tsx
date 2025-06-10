"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import formatarHorario from "@/lib/utils/formatar-horario";
import hexToRgba from "@/lib/utils/hext-to-rgba";
import { ArrowRight, CircleCheck, Ticket } from "lucide-react";
import { useConfiguracao } from "../hooks/use-configuracao";
import React, { useMemo } from "react";
import { useFila } from "../hooks/use-fila";

export default function ChamadoAtual() {
  const { configuracao } = useConfiguracao();

  const { ultimosClientesChamados } = useFila();

  const clientesParaExibir = useMemo(() => {
    const visiveis = ultimosClientesChamados.slice(1, 5);
    const faltando = Math.max(0, 4 - visiveis.length);
    return [...visiveis, ...Array(faltando).fill(null)];
  }, [ultimosClientesChamados]);
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
        className="flex-1 w-full rounded-[max(2vh,2vw)] bg-black/5 border-none items-start justify-evenly p-[max(2vh,2vw)] text-inherit gap-0 space-y-0 px-0 py-0"
        style={{
          backgroundColor: hexToRgba(configuracao.corPrimaria, 0.3),
        }}
      >
        {clientesParaExibir.map((cliente, index) => (
          <React.Fragment key={cliente?.id ?? `placeholder-${index}`}>
            {cliente ? (
              <div
                key={cliente.id}
                className="w-full h-[max(4.5vh,2vw)]  flex flex-row items-center  gap-[max(0.5vh,0.5vw)] px-[max(2vh,2vw)]  py-[max(2vh,2vw)] "
              >
                <p className="font-bold text-[max(4vh,2.5vw)] ">
                  {formatarHorario(cliente.dataHoraChamada!)}
                </p>
                <ArrowRight
                  className="h-[max(2.5vh,2.5vw)] w-[max(6vh,3vw)]"
                  style={{ color: configuracao.corSobreposicao }}
                />
                <p className="text-[max(4.5vh,2vw)] font-semibold line-clamp-2  leading-none">
                  {cliente.nome.toLocaleUpperCase()}
                </p>
              </div>
            ) : (
              <div className="w-full h-[max(7vh,7vw)] px-[max(2vh,2vw)] py-[max(2vh,2vw)]"></div>
            )}

            {index !== 3 && (
              <Separator
                style={{
                  backgroundColor: configuracao.corPrimaria,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
}
