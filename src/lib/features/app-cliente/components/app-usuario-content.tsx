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
import { Clock, LogOut, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AppUsuarioContentProps {
  dadosIniciasCliente: DadosIniciaisClienteDTO;
}

//
export default function AppUsuarioContent({
  dadosIniciasCliente,
}: AppUsuarioContentProps) {
  return (
    <div className="">
      <div
        className=" flex flex-col justify-start items-center gap-[2em] py-[3em] "
        style={{
          fontSize: "min(2vw, 0.9vh)",
          background: `linear-gradient(to bottom, ${dadosIniciasCliente.configuracao.corPrimaria} 0%, transparent 80%)`,
        }}
      >
        <div className="flex flex-col items-center gap-[1.5em]">
          <Image
            src={
              "https://avatars.githubusercontent.com/u/198528008?s=400&u=42dc338b18eeb77486dbe5a3c816808528c7d736&v=4"
            }
            width={100} // Obrigatório para Next, valor arbitrário
            height={100} // Obrigatório para Next, valor arbitrário
            alt="Logo"
            className="rounded-md object-cover w-[10em] h-[10em] "
            priority
          />
          <div className="flex flex-col items-center gap-[0.5em]">
            <p className="text-[3em]  font-bold leading-none">Beira Rio</p>
            <div className="flex flex-row items-center justify-center gap-[0.5em]">
              <MapPin className="!h-[2em] !w-[2em]" />
              <p className="text-[2em]  font-bold leading-none">
                Canoas, Rua Tamoio, 1432
              </p>
            </div>
          </div>
        </div>

        <Card className="px-[2em] w-[48em] ">
          <div className="flex flex-col gap-[2.5em]">
            <p className="text-[2em] text-center font-bold">
              Sua posição na fila
            </p>
            <p className="text-[15em] text-center font-extrabold leading-none">
              7
            </p>
            <p className="text-[1.5em] text-center text-muted-foreground">
              Atualizado em tempo real
            </p>
          </div>
          <div className="flex flex-col gap-[2em]">
            <Card className="bg-gray-100 border-none px-[1em] flex flex-row items-center gap-[1em] py-[1em]">
              <Card className="w-[4em] h-[4em] flex items-center justify-center bg-white  p-0 ">
                <Clock className="!h-[2.5em] !w-[2.5em]" />
              </Card>
              <div className="flex flex-col">
                <p className="text-[2em] font-semibold">Tempo já aguardado</p>
                <p className="text-[1.5em] text-muted-foreground">
                  Desde sua entrada na fila
                </p>
              </div>
              <p className="text-[2em]  ml-auto font-bold whitespace-nowrap">
                23 min
              </p>
            </Card>
            <Card className="bg-gray-100 border-none px-[1em] flex flex-row items-center gap-[1em] py-[1em]">
              <Card className="w-[4em] h-[4em] flex items-center justify-center bg-white  p-0 ">
                <Clock className="!h-[2.5em] !w-[2.5em]" />
              </Card>
              <div className="flex flex-col">
                <p className="text-[2em] font-semibold">
                  Tempo médio de espera
                </p>
                <p className="text-[1.5em] text-muted-foreground">
                  Baseado no fluxo da fila
                </p>
              </div>
              <p className="text-[2em] ml-auto font-bold whitespace-nowrap">
                23 min
              </p>
            </Card>
          </div>
        </Card>
        <Card className="px-[2em] w-[48em]">
          <p className="text-[2em] font-bold">Enquanto você espera</p>
          <div className="flex flex-row items-center gap-[1em]">
            <div className="w-[0.6em] h-[0.6em] rounded-full bg-green-500" />
            <p className="text-[1.5em]">
              Você receberá uma mensagem no seu WhatsApp quando chegar sua vez
            </p>
          </div>
          <div className="flex flex-row items-center gap-[1em]">
            <div className="w-[0.6em] h-[0.6em] rounded-full bg-green-500" />
            <p className="text-[1.5em]">
              Você pode desistir da fila se precisar
            </p>
          </div>
        </Card>
        <Button
          variant={"ghost"}
          className="!text-[2em] text-accent-foreground hover:text-red-500 mt-[0.5em]"
        >
          <LogOut className="!h-[1em] !w-[1em] text-accent-foreground hover:text-red-500 text-inherit" />
          Desistir da fila
        </Button>
      </div>
    </div>
  );
}
