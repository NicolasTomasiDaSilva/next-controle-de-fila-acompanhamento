"use client";
import { Badge } from "@/components/ui/badge";

import { Clock } from "lucide-react";
import { useConfiguracao } from "../hooks/use-configuracao";
import Image from "next/image";

import { useEffect, useState } from "react";
import { formatarData } from "@/lib/utils/data-hora-utils";

export default function Header() {
  const { configuracao } = useConfiguracao();
  const [dataFormatada, setDataFormatada] = useState<string | null>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      setDataFormatada(formatarData(agora).toLocaleUpperCase());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-full h-[6em] flex flex-row items-center justify-between  px-[2em] shadow-[0_0_10px_rgba(0,0,0,0.1)] gap-[1em] "
      style={{ backgroundColor: configuracao.corPrimaria }}
    >
      {configuracao.logoUrl && (
        <Image
          src={configuracao.logoUrl}
          width={100}
          height={100}
          alt="Logo"
          className="rounded-md object-cover w-[4em] h-[4em] "
          priority
        />
      )}

      <h1
        className="text-[3em]
      font-bold whitespace-nowrap text-shadow text-ellipsis overflow-hidden "
      >
        {configuracao.nomeDisplay.toLocaleUpperCase()}
      </h1>

      <div className="h-[2em] rounded-full bg-black/5 flex flex-row items-center gap-2 !py-[1.5em] !px-[1em] ml-auto ">
        <Clock className="!h-[2em] !w-[2em] icon-shadow" />
        <p className="text-[2em] text-shadow whitespace-nowrap">
          {dataFormatada && dataFormatada}
        </p>
      </div>
    </div>
  );
}
