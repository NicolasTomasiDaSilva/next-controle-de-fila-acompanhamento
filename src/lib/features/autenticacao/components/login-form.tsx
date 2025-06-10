"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/use-login";
import { QRCode } from "react-qrcode-logo";
import { ExpirationBar } from "./expiration-bar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, RefreshCcw } from "lucide-react";
export default function LoginForm() {
  const {
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
  } = useLogin();
  return (
    <div className="w-full">
      {step === 1 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-muted-foreground">
                    Insira os dados para vinculação
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="!text-lg h-12 px-4 py-3 !w-full bg-white"
                      maxLength={18}
                      {...field}
                      value={inputMask}
                      onChange={(e) => handleMaskedChange(e.target.value)}
                      placeholder="Digite o CPF ou CNPJ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={"azul"}
              className="block ml-auto"
              disabled={isSubmitting}
              size={"lg"}
              type="submit"
            >
              {isSubmitting ? "Gerando Código..." : "Vincular"}
              {!isSubmitting && <ChevronRight className="inline ml-2" />}
            </Button>
          </form>
        </Form>
      )}
      {step === 2 &&
        codigo &&
        dataExpiracao &&
        (qrcodeExpirado ? (
          <Button
            type="button"
            className="block mx-auto"
            disabled={isSubmitting}
            variant={"outline"}
            onClick={handleGerarNovamente}
          >
            <RefreshCcw className="inline mr-2"></RefreshCcw>
            {isSubmitting ? "Gerando..." : "Gerar Novamente"}
          </Button>
        ) : (
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-row gap-4 justify-center gap-4">
              <div className="w-50">
                <QRCode
                  value={codigo}
                  bgColor="transparent"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-7xl font-extrabold">{codigo}</p>
              </div>
            </div>
            <div className="w-[70%] mx-auto ">
              <ExpirationBar dataExpiracao={dataExpiracao} />
            </div>
          </div>
        ))}
    </div>
  );
}
