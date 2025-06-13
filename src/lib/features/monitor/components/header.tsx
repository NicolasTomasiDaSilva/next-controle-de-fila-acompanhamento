"use client";
import { Badge } from "@/components/ui/badge";
import formatarData from "@/lib/utils/formatar-data";
import { Clock } from "lucide-react";
import { useConfiguracao } from "../hooks/use-configuracao";

import { useEffect, useState } from "react";

export default function Header() {
  const { configuracao } = useConfiguracao();
  const [dataFormatada, setDataFormatada] = useState<string | null>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      setDataFormatada(formatarData(agora));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-full h-[6em] flex flex-row items-center justify-between  px-[2em] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      style={{ backgroundColor: configuracao.corPrimaria }}
    >
      <h1
        className="text-[3em]
      font-extrabold whitespace-nowrap text-shadow"
      >
        BANCO DO BRASIL
      </h1>

      <div className="h-[2em] rounded-full bg-black/5 flex flex-row items-center gap-2 !py-[1.5em] !px-[1em] ">
        <Clock className="!h-[2.5em] !w-[2.5em] icon-shadow" />
        <p className="text-[2em] text-shadow">
          {dataFormatada && dataFormatada}
        </p>
      </div>
    </div>
  );
}
