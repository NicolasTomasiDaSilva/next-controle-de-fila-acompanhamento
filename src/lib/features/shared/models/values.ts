import { isCNPJ, isCPF } from "brazilian-values";
import { z } from "zod";

export const codigoSchema = z.string().regex(/^[a-zA-Z0-9]{4}$/, {
  message: "Código inválido",
});

export const cpfCnpjSchema = z
  .string()
  .nonempty("CPF ou CNPJ é obrigatório")
  .refine((value) => value.length === 11 || value.length === 14, {
    message: "Deve ter exatamente 11 dígitos para CPF ou 14 dígitos para CNPJ",
  })
  .refine(
    (value) => {
      if (value.length === 11) return isCPF(value);
      if (value.length === 14) return isCNPJ(value);
      return false;
    },
    {
      message: "CPF ou CNPJ inválido",
    }
  );

export const codigoVinculacaoMonitorSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{4}$/, { message: "Código inválido" });
