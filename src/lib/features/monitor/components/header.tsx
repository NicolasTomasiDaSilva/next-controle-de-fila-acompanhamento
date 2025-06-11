import { Badge } from "@/components/ui/badge";
import formatarData from "@/lib/utils/formatar-data";
import { Clock } from "lucide-react";
import { useConfiguracao } from "../hooks/use-configuracao";

export default function Header() {
  const { configuracao } = useConfiguracao();
  const agora = new Date();
  const dataFormatada = formatarData(agora);
  return (
    <div
      className="w-full h-[max(10vh,6vw)] flex flex-row items-center justify-between py-[max(2vh,2vw)] px-[max(2vh,2vw)] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      style={{ backgroundColor: configuracao.corPrimaria }}
    >
      <h1
        className="text-[max(4vh,3vw)]
      font-extrabold whitespace-nowrap text-shadow"
      >
        BANCO DO BRASIL
      </h1>

      <Badge className="h-[max(2vh,2vw)] rounded-full bg-black/5 flex flex-row items-center gap-2 !py-[max(1.5vh,1.5vw)] !px-[max(0.75vh,0.75vw)] text-inherit ">
        <Clock className="!h-[max(2vh,2vw)] !w-[max(2vh,2vw)] icon-shadow" />
        <p className="text-[max(2vh,2vw)] text-shadow">{dataFormatada}</p>
      </Badge>
    </div>
  );
}
