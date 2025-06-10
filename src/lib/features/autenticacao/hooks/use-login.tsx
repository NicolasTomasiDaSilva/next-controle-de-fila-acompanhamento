import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import LogoCervantes from "@/assets/images/logo-cervantes.jpg";
import Image from "next/image";
import Link from "next/link";
import { empresaSchema } from "../../monitor/models/empresa";

import z, { set } from "zod";
import { formatarCpfCnpj } from "@/lib/utils/cpf-cnpj-utils";
import { cpfCnpjSchema } from "../../shared/models/values";
import { vinculacaoService } from "../../monitor/services/vinculacao-service";
import { toast } from "sonner";
import { HubConnection } from "@microsoft/signalr";
import { connectToHub } from "@/lib/signalr/client";
import { eventosHubMonitor } from "@/constantes/eventos-hub-monitor";
import { AuthTokens, authTokensSchema } from "../models/auth-tokens";
import { autenticacaoService } from "../services/autenticacao-service";
import { useRouter } from "next/navigation";

export function useLogin() {
  const formSchema = z.object({
    cpfCnpj: cpfCnpjSchema,
  });
  type FormData = z.infer<typeof formSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { cpfCnpj: "" },
  });
  const router = useRouter();
  const [idVinculacao, setIdVinculacao] = useState<string | null>(null);
  const [cpfCnpj, setCpfCnpj] = useState<string>("");
  const [codigo, setCodigo] = useState<string | null>(null);
  const [dataExpiracao, setDataExpiracao] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [qrcodeExpirado, setQrcodeExpirado] = useState<boolean>(false);
  const [inputMask, setInputMask] = useState<string>("");

  const handleMaskedChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    const masked = formatarCpfCnpj(raw);
    setInputMask(masked);
    form.setValue("cpfCnpj", raw);
  };

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true);
      const { codigo, dataExpiracao, idVinculacao } =
        await vinculacaoService.gerarCodigoVinculacao(data.cpfCnpj);
      toast.success("Código gerado com sucesso!");
      setIdVinculacao(idVinculacao);
      setCpfCnpj(data.cpfCnpj);
      setCodigo(codigo);
      setDataExpiracao(dataExpiracao);
      setStep(2);
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar o código.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGerarNovamente() {
    try {
      setIsSubmitting(true);
      const { codigo, dataExpiracao, idVinculacao } =
        await vinculacaoService.gerarCodigoVinculacao(cpfCnpj);
      toast.success("Código gerado com sucesso!");
      setCodigo(codigo);
      setIdVinculacao(idVinculacao);

      setDataExpiracao(dataExpiracao);
      setQrcodeExpirado(false);
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar o código.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!dataExpiracao) {
      setQrcodeExpirado(false);
      return;
    }

    const now = new Date();
    if (now >= dataExpiracao) {
      // Já expirou
      setQrcodeExpirado(true);
      setIdVinculacao(null);
      return;
    }

    // Calcula o tempo até a expiração em ms
    const timeout = dataExpiracao.getTime() - now.getTime();

    // Define um timer que vai setar expirado quando chegar a hora
    const timerId = setTimeout(() => {
      setQrcodeExpirado(true);
      setIdVinculacao(null);
    }, timeout);

    // Se mudar a dataExpiracao ou desmontar, limpa o timer
    return () => clearTimeout(timerId);
  }, [dataExpiracao]);

  useEffect(() => {
    if (!idVinculacao) {
      return;
    }

    let connection: HubConnection;
    let isMounted = true;

    async function startConnection() {
      try {
        if (!isMounted) {
          return;
        }
        connection = await connectToHub("controledefilahub", {
          idVinculacao: idVinculacao as string,
        });
        connection.on(eventosHubMonitor.Vinculado, async (data) => {
          const result = authTokensSchema.safeParse(data);
          if (!result.success) {
            throw new Error(result.error.message);
          }
          const tokens: AuthTokens = result.data;
          await autenticacaoService.login(tokens);
          router.push("/monitor");
        });

        await connection.start();
        console.log("✅ SignalR conectado");
      } catch (error) {
        toast.error("Erro ao fazer vinculação.");
        await autenticacaoService.logout();
        router.push("/monitor/login");
      }
    }

    startConnection();

    return () => {
      isMounted = false;
      if (connection) {
        connection.stop();
      }
    };
  }, [idVinculacao]);

  return {
    form,
    step,
    setStep,
    inputMask,
    handleMaskedChange,
    onSubmit,
    codigo,
    dataExpiracao,
    isSubmitting,
    qrcodeExpirado,
    handleGerarNovamente,
  };
}
