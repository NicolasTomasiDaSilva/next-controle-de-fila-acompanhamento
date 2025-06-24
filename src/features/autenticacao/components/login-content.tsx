"use client";

import LoginForm from "./login-form";
import LogoCervantes from "@/assets/images/logo-cervantes.jpg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useLogin } from "../hooks/use-login";

export default function LoginContent() {
  const {
    form,
    step,
    inputMask,
    handleMaskedChange,
    onSubmit,
    codigo,
    dataExpiracao,
    isSubmitting,
    qrcodeExpirado,
    handleGerarNovamente,
    handleVoltar,
  } = useLogin();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 max-w-xl mx-auto ">
      <div className="flex flex-col items-center gap-4 w-full relative ">
        {step == 2 && (
          <div className="absolute top-0 left-0">
            <Button variant="ghost" onClick={() => handleVoltar()}>
              <ChevronLeft />
            </Button>
          </div>
        )}

        <Image
          src={LogoCervantes}
          alt="Logo"
          className="size-30 rounded-md mx-auto"
        />
        <h2 className="text-4xl font-bold">Monitor de Fila</h2>
      </div>
      <Separator className=" bg-white !w-4/4 !h-1 rounded-full" />

      <LoginForm
        form={form}
        step={step}
        inputMask={inputMask}
        handleMaskedChange={handleMaskedChange}
        onSubmit={onSubmit}
        codigo={codigo}
        dataExpiracao={dataExpiracao}
        isSubmitting={isSubmitting}
        qrcodeExpirado={qrcodeExpirado}
        handleGerarNovamente={handleGerarNovamente}
      ></LoginForm>
    </div>
  );
}
