import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DadosIniciaisClienteDTO } from "../models/cliente-dados-iniciais";

interface AppUsuarioContentProps {
  dadosIniciasCliente: DadosIniciaisClienteDTO;
}

export default function AppUsuarioContent({
  dadosIniciasCliente,
}: AppUsuarioContentProps) {
  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${dadosIniciasCliente.configuracao.corPrimaria} 0%, transparent 80%)`,
      }}
      className="h-full flex flex-col  justify-center items-center "
    >
      <Card className="w-[max(35vh,50vw)] h-[max(70vh,35vw)]">
        <p className="text-[max(2vh,2vw)] text-center font-bold">
          Sua posição na fila
        </p>
        <p className="text-[max(4vh,4vw)] text-center font-bold">
          {dadosIniciasCliente.cliente.posicao}
        </p>
      </Card>
    </div>
  );
}
