"use client";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useFila } from "../hooks/use-fila";
import { motion } from "framer-motion";

const animacao = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1 },
};

export default function ChamadoAtual() {
  const { ultimosClientesChamados } = useFila();
  return (
    <div className="h-full flex flex-col  justify-center items-center ">
      <div className="flex flex-row items-center gap-[max(1vh,1vw)] mb-[max(1vh,1vw)]">
        <Ticket className="h-[max(3.5vh,2vw)] w-[max(3.5vh,2vw)] icon-shadow" />
        <p
          className="text-[max(3vh,1.5vw)]
      font-extrabold whitespace-nowrap text-shadow"
        >
          CHAMADO ATUAL
        </p>
      </div>

      <Card className="flex-1 w-full rounded-[max(2vh,2vw)] flex flex-col justify-center items-center p-[max(2vh,2vw)] shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none">
        {ultimosClientesChamados[0]?.nome && (
          <motion.p
            key={ultimosClientesChamados[0].nome}
            initial="hidden"
            animate="visible"
            variants={animacao}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[max(8vh,5vw)]
      font-extrabold text-center leading-snug text-shadow
    "
          >
            {ultimosClientesChamados[0].nome.toUpperCase()}
          </motion.p>
        )}
      </Card>
    </div>
  );
}
