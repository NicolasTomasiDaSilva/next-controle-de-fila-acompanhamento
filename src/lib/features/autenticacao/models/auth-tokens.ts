import { z } from "zod";

export const authTokensSchema = z.object({
  accessToken: z.string().min(1, "Access token é obrigatório"),
  refreshToken: z.string().min(1, "Refresh token é obrigatório"),
});

export type AuthTokens = z.infer<typeof authTokensSchema>;
