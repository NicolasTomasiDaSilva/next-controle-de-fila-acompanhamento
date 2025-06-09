import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const tokensCookiesParams: Partial<ResponseCookie> = {
  httpOnly: true, // Impede acesso via JavaScript (protege contra XSS)
  secure: false, // False em localhost, true em produção (HTTPS)
  sameSite: "lax", // Ou "lax", dependendo do comportamento desejado
  path: "/", // Disponível em todas as rotas
  maxAge: 30 * 24 * 60 * 60, // 30 dias para refreshToken
};
