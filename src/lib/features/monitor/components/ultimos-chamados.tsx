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

interface UltimosChamadosProps {
  ultimosChamados: Cliente[];
}
export default function UltimosChamados({
  ultimosChamados,
}: UltimosChamadosProps) {
  const { configuracao } = useConfiguracao();

  const clientesParaExibir: (Cliente | null)[] = useMemo(() => {
    const visiveis = ultimosChamados.slice(1, 5);
    const faltando = Math.max(0, 4 - visiveis.length);
    return [...visiveis, ...Array(faltando).fill(null)];
  }, [ultimosChamados]);

  return (
    <div className=" h-full w-full flex flex-col  justify-center items-center ">
      <div className="flex flex-row items-center gap-[1em] mb-[1em]">
        <CircleCheck className="h-[2em] w-[2em] icon-shadow" />
        <p
          className="text-[1.5em]
      font-extrabold whitespace-nowrap text-shadow
 "
        >
          ÚLTIMOS CHAMADOS
        </p>
      </div>

      <Card
        className="flex-1 w-full rounded-[1.5em]  border-none items-start justify-evenly px-[1em] text-inherit gap-0 space-y-0  py-0 shadow-none shadow-[0_0_10px_rgba(0,0,0,0.1)] "
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
            {cliente && (
              <div className="w-full flex flex-row items-center  gap-[1em] px-[2em]  py-[2em)]">
                <p className="font-bold text-[2.5em] text-shadow ">
                  {formatarHorario(cliente.dataHoraChamada)}
                </p>
                <ArrowRight
                  className="h-[1.5em] w-[1.5em] icon-shadow"
                  style={{ color: configuracao.corSobreposicao }}
                />
                <p className="text-[2.5em] font-semibold line-clamp-2  leading-none text-shadow">
                  {cliente?.nome?.toLocaleUpperCase()}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </Card>
    </div>
  );
}
