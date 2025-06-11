"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import formatarHorario from "@/lib/utils/formatar-horario";
import { lightenColor } from "@/lib/utils/color-utils";
import { ArrowRight, CircleCheck, Ticket } from "lucide-react";
import { useConfiguracao } from "../hooks/use-configuracao";
import React, { useMemo, useState } from "react";
import { useFila } from "../hooks/use-fila";
import { motion, AnimatePresence } from "framer-motion";
import { Cliente } from "../models/cliente";
import { StatusEnum } from "@/lib/enums/status-enum";

const animacao = {
  hidden: { opacity: 0, x: -30 }, // começa 30px à esquerda e invisível
  visible: { opacity: 1, x: 0 }, // termina no lugar e visível
};
export default function ChamadoAtual() {
  const { configuracao } = useConfiguracao();

  const { fila } = useFila();

  const [ultimosClientesChamados, setUltimosClientesChamados] = useState<
    Cliente[]
  >(
    fila.clientes
      .filter((cliente) => cliente.status === StatusEnum.Chamado)
      .sort(
        (a, b) =>
          new Date(b.dataHoraChamada!).getTime() -
          new Date(a.dataHoraChamada!).getTime()
      )
  );

  const clientesParaExibir = useMemo(() => {
    const visiveis = ultimosClientesChamados.slice(1, 5);
    const faltando = Math.max(0, 4 - visiveis.length);
    return [...visiveis, ...Array(faltando).fill(null)];
  }, [ultimosClientesChamados]);

  return (
    <div className="  h-full flex flex-col  justify-center items-center ">
      <div className="flex flex-row items-center gap-[max(1vh,1vw)] mb-[max(1vh,1vw)]">
        <CircleCheck className="h-[max(3.5vh,2vw)] w-[max(3.5vh,2vw)] icon-shadow" />
        <p
          className="text-[max(3vh,1.5vw)]
      font-extrabold whitespace-nowrap text-shadow
 "
        >
          ÚLTIMOS CHAMADOS
        </p>
      </div>

      <Card
        className="flex-1 w-full rounded-[max(2vh,2vw)]  border-none items-start justify-evenly px-[max(2vh,2vw)] text-inherit gap-0 space-y-0  py-0 shadow-none shadow-[0_0_10px_rgba(0,0,0,0.1)]"
        style={{
          backgroundColor: lightenColor(configuracao.corPrimaria, 5),
        }}
      >
        {clientesParaExibir.map((cliente, index) => (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animacao}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={cliente?.id ?? `placeholder-${index}`}
            className="w-full flex-1 flex flex-col items-center justify-center border-b-1 border-white/30 last:border-0"
          >
            {cliente ? (
              <div className="w-full flex flex-row items-center  gap-[max(0.5vh,0.5vw)] px-[max(2vh,2vw)]  py-[max(2vh,2vw)]">
                <p className="font-bold text-[max(4vh,2.5vw)] text-shadow ">
                  {formatarHorario(cliente.dataHoraChamada!)}
                </p>
                <ArrowRight
                  className="h-[max(2.5vh,2vw)] w-[max(6vh,3vw)] icon-shadow"
                  style={{ color: configuracao.corSobreposicao }}
                />
                <p className="text-[max(4.5vh,2vw)] font-semibold line-clamp-2  leading-none text-shadow">
                  {cliente.nome.toLocaleUpperCase()}
                </p>
              </div>
            ) : null}
          </motion.div>
        ))}
      </Card>
    </div>
  );
}
