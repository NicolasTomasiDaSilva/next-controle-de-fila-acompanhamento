"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

type ExpirationBarProps = {
  dataExpiracao: Date; // ISO string
};

export function ExpirationBar({ dataExpiracao }: ExpirationBarProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = new Date().getTime();
    const end = dataExpiracao.getTime();
    const total = end - start;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const pct = 100 - (elapsed / total) * 100;

      setProgress(Math.max(0, Math.min(100, pct)));
    }, 1000); // atualiza a cada segundo

    return () => clearInterval(interval);
  }, [dataExpiracao]);

  return (
    <Progress
      corFundo={"bg-blue-200"}
      corBarra={"bg-blue-500"}
      className="w-full h-3"
      value={progress}
    />
  );
}
