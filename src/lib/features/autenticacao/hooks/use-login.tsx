import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

import LogoCervantes from "@/assets/images/logo-cervantes.jpg";
import Image from "next/image";
import Link from "next/link";
import { empresaSchema } from "../../monitor/models/empresa";

import z, { set } from "zod";
import { formatarCpfCnpj } from "@/lib/utils/cpf-cnpj-utils";
import { cpfCnpjSchema } from "../../shared/models/values";
import { vinculacaoService } from "../../monitor/services/vinculacao-service";
import { toast } from "sonner";

export function useLogin() {
  const formSchema = z.object({
    cpfCnpj: cpfCnpjSchema,
  });
  type FormData = z.infer<typeof formSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { cpfCnpj: "" },
  });
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
      const { codigo, dataExpiracao } =
        await vinculacaoService.gerarCodigoVinculacao(data.cpfCnpj);
      toast.success("Código gerado com sucesso!");
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
      const { codigo, dataExpiracao } =
        await vinculacaoService.gerarCodigoVinculacao(cpfCnpj);
      toast.success("Código gerado com sucesso!");
      setCodigo(codigo);
      setDataExpiracao(dataExpiracao);
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar o código.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
