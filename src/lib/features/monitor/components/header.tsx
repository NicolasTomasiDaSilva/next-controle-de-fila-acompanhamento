import { Badge } from "@/components/ui/badge";
import formatarData from "@/lib/utils/formatar-data";
import { Clock } from "lucide-react";

export default function Header() {
  const agora = new Date();
  const dataFormatada = formatarData(agora);
  return (
    <div className="w-full h-[max(10vh,6vw)] flex flex-row items-center justify-between py-[max(2vh,2vw)] px-[max(2vh,2vw)] shadow-sm bg-black/5">
      <h1
        className="text-[max(4.5vh,3vw)]
      font-extrabold whitespace-nowrap"
      >
        BANCO DO BRASIL
      </h1>

      <Badge className="h-[max(2vh,2vw)] rounded-full bg-black/15 flex flex-row items-center gap-2 !py-[max(1.5vh,1.5vw)] !px-[max(0.75vh,0.75vw)] text-inherit">
        <Clock className="!h-[max(2vh,2vw)] !w-[max(2vh,2vw)]" />
        <p className="text-[max(2vh,2vw)]">{dataFormatada}</p>
      </Badge>
    </div>
  );
}
