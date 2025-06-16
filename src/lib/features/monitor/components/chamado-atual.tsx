"use client";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useFila } from "../hooks/use-fila";
import { motion } from "framer-motion";
import { Cliente } from "../models/cliente";
import { useState } from "react";
import { StatusEnum } from "@/lib/enums/status-enum";

const animacao = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1 },
};
interface ChamadoAtualProps {
  ultimosChamados: Cliente[];
}
export default function ChamadoAtual({ ultimosChamados }: ChamadoAtualProps) {
  return (
    <div className="h-full w-full flex flex-col  justify-center items-center ">
      <div className="flex flex-row items-center gap-[1em] mb-[1em]">
        <Ticket className="h-[2em] w-[2em] icon-shadow" />
        <p
          className="text-[1.5em]
      font-extrabold whitespace-nowrap text-shadow"
        >
          CHAMADO ATUAL
        </p>
      </div>

      <Card className="flex-1 w-full rounded-[1.5em] flex flex-col justify-center items-center  shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none p-[3em] ">
        {ultimosChamados[0]?.nome && (
          <motion.p
            key={ultimosChamados[0].nome}
            initial="hidden"
            animate="visible"
            variants={animacao}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[5em]
      font-extrabold text-center leading-snug text-shadow break-words 
    "
          >
            {ultimosChamados[0].nome.toUpperCase()}
          </motion.p>
        )}
      </Card>
    </div>
  );
}
