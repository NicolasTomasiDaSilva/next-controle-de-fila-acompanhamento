"use client";
import { Card } from "@/components/ui/card";
import Lottie from "lottie-react";
import { DadosIniciaisClienteDTO } from "../models/cliente-dados-iniciais";
import { Clock, LogOut, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BottomSheetDialog from "./botao-desistir";
import { StatusEnum } from "@/lib/enums/status-enum";

import { useTempoDecorrido } from "./use-tempo-decorrido";
import BotaoDesisitir from "./botao-desistir";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import ChamadoAtual from "../../monitor/components/chamado-atual";
import { useSignalrAppCliente } from "../hooks/use-signalr-app-cliente";
import useAppCliente from "../hooks/use-app-cliente";

import AtivarNotificacoesSonorasDialog from "../../shared/components/ativar-notificacoes-sonoras-dialog";
import {
  calcularIntervaloTempoEmMinutos,
  formatarTempoDecorrido,
} from "@/lib/utils/data-hora-utils";

interface AppUsuarioContentProps {
  dadosIniciasCliente: DadosIniciaisClienteDTO;
  hash: string;
}

export default function AppClienteContent({
  dadosIniciasCliente,
  hash,
}: AppUsuarioContentProps) {
  const {
    cliente,
    configuracao,
    fila,
    handleEventoAtualizarCliente,
    handleDesisitir,
  } = useAppCliente({ dadosIniciasCliente, hash });

  useSignalrAppCliente({
    hash,
    handleEventoAtualizarCliente,
  });

  const tempoDecorrido = useTempoDecorrido(
    dadosIniciasCliente.cliente.dataHoraCriado
  );
  return (
    <>
      <AtivarNotificacoesSonorasDialog />
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          backgroundImage: "none",
          background: `linear-gradient(to bottom, ${configuracao.corPrimaria} 0%, white 100%)`,
        }}
      >
        <div className="flex flex-col justify-center items-center gap-2 p-2 max-w-150">
          <Card className="px-4 w-full py-4 gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl font-extrabold leading-none text-center line-clamp-2">
                {configuracao.nomeDisplay}
              </p>
              {configuracao.logoUrl && (
                <Image
                  src={configuracao.logoUrl}
                  width={100}
                  height={100}
                  alt="Logo"
                  className="rounded-md object-cover w-25 h-25"
                  priority
                />
              )}

              {configuracao.enderecoDisplay && (
                <p className="leading-none  text-center max-w-full text-muted-foreground">
                  <MapPin className="!h-5 !w-5 inline text-black" />{" "}
                  {configuracao.enderecoDisplay}
                </p>
              )}
            </div>
            <div className="flex flex-col h-45 justify-between ">
              {cliente.status === StatusEnum.Aguardando && (
                <>
                  <p className="text-center font-bold">Sua posição na fila</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={cliente.posicao}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`font-(family-name:--font-geist-sans) text-9xl  text-center font-extrabold leading-none`}
                      style={{
                        color: configuracao.corPrimaria,
                      }}
                    >
                      {cliente.posicao}
                    </motion.div>
                  </AnimatePresence>

                  <p className=" text-center text-muted-foreground">
                    Atualizado em tempo real
                  </p>
                </>
              )}
              {cliente.status !== StatusEnum.Aguardando && (
                <AnimatePresence mode="wait">
                  <motion.div
                    className="mx-auto my-auto text-center font-bold"
                    key={cliente.status}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {cliente.status === StatusEnum.Chamado && (
                      <p className="text-green-500 text-3xl">
                        Você foi chamado!
                      </p>
                    )}
                    {cliente.status === StatusEnum.Removido && (
                      <p className="text-red-500 text-3xl">Você foi removido</p>
                    )}
                    {cliente.status === StatusEnum.Desistente && (
                      <p className="text-orange-500 text-3xl">
                        Você saiu da fila
                      </p>
                    )}
                    {cliente.status === StatusEnum.Ausente && (
                      <p className="text-yellow-500 text-3xl">
                        Você não compareceu
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Card className="bg-gray-100 border-none px-2 flex flex-row items-center gap-2 py-1.5 rounded-1">
                <Card className="w-10 h-10 flex items-center justify-center bg-white  p-0 rounded-1">
                  <Clock
                    className="!h-5 !w-5"
                    style={{
                      color: configuracao.corPrimaria,
                    }}
                  />
                </Card>
                <div className="flex flex-col">
                  <p className=" font-semibold">Tempo já aguardado</p>
                  <p className=" text-muted-foreground text-sm">
                    Desde sua entrada na fila
                  </p>
                </div>
                <p className="  ml-auto font-bold whitespace-nowrap">
                  {cliente.status === StatusEnum.Aguardando
                    ? tempoDecorrido
                    : "--"}
                </p>
              </Card>
              <Card className="bg-gray-100 border-none px-2 flex flex-row items-center gap-2 py-1.5 rounded-1">
                <Card className="w-10 h-10 flex items-center justify-center bg-white  p-0 rounded-1 ">
                  <Clock
                    className="!h-5 !w-5"
                    style={{
                      color: configuracao.corPrimaria,
                    }}
                  />
                </Card>
                <div className="flex flex-col">
                  <p className="font-semibold">Tempo médio de espera</p>
                  <p className="text-muted-foreground text-sm">
                    Baseado no fluxo da fila
                  </p>
                </div>
                <p className=" ml-auto font-bold whitespace-nowrap">
                  {formatarTempoDecorrido(
                    calcularIntervaloTempoEmMinutos(fila.tempoMedioEspera!)
                  )}
                </p>
              </Card>
            </div>
          </Card>
          <Card className="px-4 w-full py-4 gap-4">
            <p className="font-bold">Enquanto você espera</p>
            <div className="flex flex-row items-center gap-2">
              <div
                className="!w-1 !h-1 rounded-full shrink-0 "
                style={{
                  backgroundColor: configuracao.corPrimaria,
                }}
              />
              <p className="text-sm">
                Você receberá uma mensagem no seu WhatsApp quando chegar sua vez
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div
                className="!w-1 !h-1 rounded-full shrink-0"
                style={{
                  backgroundColor: configuracao.corPrimaria,
                }}
              />
              <p className="text-sm">Você pode desistir da fila se precisar</p>
            </div>
          </Card>
          {cliente.status === StatusEnum.Aguardando && (
            <BotaoDesisitir handleDesisitir={handleDesisitir} />
          )}
        </div>
      </div>
    </>
  );
}
