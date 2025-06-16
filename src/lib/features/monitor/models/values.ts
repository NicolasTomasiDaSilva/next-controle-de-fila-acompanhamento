import { isCNPJ, isCPF, isPhone } from "brazilian-values";
import z, {
  ZodType,
  ZodNullable,
  ZodString,
  ZodEffects,
  ZodTypeAny,
} from "zod";

// Tipos intermediários para legibilidade
type NullableStringSchema = ZodNullable<
  ZodEffects<ZodString, string | null, string>
>;
type NonNullableStringSchema = ZodEffects<ZodString, string, string>;

// 👇 SOBRECARREGAS
export function texto(params: {
  campo: string;
  min?: number;
  max?: number;
  transformarEmNull: true;
}): NullableStringSchema;

export function texto(params: {
  campo: string;
  min?: number;
  max?: number;
  transformarEmNull?: false;
}): NonNullableStringSchema;

// 👇 IMPLEMENTAÇÃO
export function texto({
  campo,
  min = 1,
  max = 50,
  transformarEmNull = false,
}: {
  campo: string;
  min?: number;
  max?: number;
  transformarEmNull?: boolean;
}): ZodTypeAny {
  if (transformarEmNull) {
    return z
      .string()
      .transform((val) => (val.trim() === "" ? null : val.trim()))
      .nullable()
      .refine((val) => val === null || val.length >= min, {
        message: `${campo} deve ter no mínimo ${min} caracteres`,
      })
      .refine((val) => val === null || val.length <= max, {
        message: `${campo} deve ter no máximo ${max} caracteres`,
      });
  }

  return z
    .string()
    .trim()
    .refine((val) => val.length > 0, {
      message: `${campo} é obrigatório`,
    })
    .refine((val) => val.length >= min, {
      message: `${campo} deve ter no mínimo ${min} caracteres`,
    })
    .refine((val) => val.length <= max, {
      message: `${campo} deve ter no máximo ${max} caracteres`,
    });
}

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

export const telefoneSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? null : val))
  .refine(
    (val) => {
      if (val === null) return true;

      const apenasDigitos = val.replace(/\D/g, "");
      const regexTelefone = /^(\d{2})(\d{8,9})$/;

      return regexTelefone.test(apenasDigitos);
    },
    {
      message: "Telefone inválido",
    }
  )
  .transform((val) => (val ? val.replace(/\D/g, "") : null))
  .nullable();

export const codigoVinculacaoSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{4}$/, { message: "Código inválido" });

export const codigoAcessoSchema = z.string().regex(/^\d{6}$/, {
  message: "Código inválido",
});
