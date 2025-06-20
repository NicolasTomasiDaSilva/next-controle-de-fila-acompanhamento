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
import { Geist } from "next/font/google";
import { formatarIntervaloTempoEmMinutos } from "@/lib/utils/data-hora-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSom } from "../../shared/hooks/use-som";
import AtivarNotificacoesSonorasDialog from "../../shared/components/ativar-notificacoes-sonoras-dialog";

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

  const minutos = useTempoDecorrido(dadosIniciasCliente.cliente.dataHoraCriado);
  return (
    <>
      <AtivarNotificacoesSonorasDialog />
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          fontSize: "min(1vh, 2vw)",
          backgroundImage: "none",
          background: `linear-gradient(to bottom, ${configuracao.corPrimaria} 0%, white 100%)`,
        }}
      >
        <div className="flex  flex-col justify-center items-center gap-[1.5em]  p-[2em] max-w-[75em] ">
          <Card className="px-[2em] w-full">
            <div className="flex flex-col items-center gap-[1em]">
              <p className="text-[3em]  font-extrabold leading-none">
                {configuracao.nomeDisplay}
              </p>
              {configuracao.logoUrl && (
                <Image
                  src={configuracao.logoUrl}
                  width={100}
                  height={100}
                  alt="Logo"
                  className="rounded-md object-cover w-[10em] h-[10em]"
                  priority
                />
              )}

              <div className="flex flex-row items-center justify-center gap-[0.5em]">
                <MapPin className="!h-[2em] !w-[2em]" />
                <p className="text-[2em]  leading-none">
                  {configuracao.enderecoDisplay}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-[2.5em] h-[25em] justify-between ">
              {cliente.status === StatusEnum.Aguardando && (
                <>
                  <p className="text-[2em] text-center font-bold">
                    Sua posição na fila
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={cliente.posicao}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`font-(family-name:--font-geist-sans) text-[15em]  text-center font-extrabold leading-none`}
                      style={{
                        color: configuracao.corPrimaria,
                      }}
                    >
                      {cliente.posicao}
                    </motion.div>
                  </AnimatePresence>

                  <p className="text-[1.5em] text-center text-muted-foreground">
                    Atualizado em tempo real
                  </p>
                </>
              )}
              {cliente.status !== StatusEnum.Aguardando && (
                <AnimatePresence mode="wait">
                  <motion.div
                    className="mx-auto my-auto text-[3.5em] text-center font-bold"
                    key={cliente.status}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {cliente.status === StatusEnum.Chamado && (
                      <p className="text-green-500">Você foi chamado!</p>
                    )}
                    {cliente.status === StatusEnum.Removido && (
                      <p className="text-red-500">Você foi removido</p>
                    )}
                    {cliente.status === StatusEnum.Desistente && (
                      <p className="text-orange-500">Você saiu da fila</p>
                    )}
                    {cliente.status === StatusEnum.Ausente && (
                      <p className="text-yellow-500">Você não compareceu</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="flex flex-col gap-[2em]">
              <Card className="bg-gray-100 border-none px-[1em] flex flex-row items-center gap-[1em] py-[1em] rounded-[1em]">
                <Card className="w-[4em] h-[4em] flex items-center justify-center bg-white  p-0 rounded-[1em]">
                  <Clock
                    className="!h-[2.5em] !w-[2.5em]"
                    style={{
                      color: configuracao.corPrimaria,
                    }}
                  />
                </Card>
                <div className="flex flex-col">
                  <p className="text-[2em] font-semibold">Tempo já aguardado</p>
                  <p className="text-[1.5em] text-muted-foreground">
                    Desde sua entrada na fila
                  </p>
                </div>
                <p className="text-[2em]  ml-auto font-bold whitespace-nowrap">
                  {cliente.status === StatusEnum.Aguardando
                    ? `${minutos} min`
                    : "--"}
                </p>
              </Card>
              <Card className="bg-gray-100 border-none px-[1em] flex flex-row items-center gap-[1em] py-[1em] rounded-[1em]">
                <Card className="w-[4em] h-[4em] flex items-center justify-center bg-white  p-0 rounded-[1em] ">
                  <Clock
                    className="!h-[2.5em] !w-[2.5em]"
                    style={{
                      color: configuracao.corPrimaria,
                    }}
                  />
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
                  {formatarIntervaloTempoEmMinutos(fila.tempoMedioEspera!)} min
                </p>
              </Card>
            </div>
          </Card>
          <Card className="px-[2em] w-full">
            <p className="text-[2em] font-bold">Enquanto você espera</p>
            <div className="flex flex-row items-center gap-[1em]">
              <div
                className="w-[0.6em] h-[0.6em] rounded-full "
                style={{
                  backgroundColor: configuracao.corPrimaria,
                }}
              />
              <p className="text-[1.5em]">
                Você receberá uma mensagem no seu WhatsApp quando chegar sua vez
              </p>
            </div>
            <div className="flex flex-row items-center gap-[1em]">
              <div
                className="w-[0.6em] h-[0.6em] rounded-full "
                style={{
                  backgroundColor: configuracao.corPrimaria,
                }}
              />
              <p className="text-[1.5em]">
                Você pode desistir da fila se precisar
              </p>
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
