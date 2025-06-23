import { jwtDecode } from "jwt-decode";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

type JWTPayload = {
  exp?: number;
  [key: string]: any;
};

export function jwtIsValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (!decoded.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
}

export const tokensCookiesParams: Partial<ResponseCookie> = {
  httpOnly: true, // Impede acesso via JavaScript (protege contra XSS)
  secure: false, // False em localhost, true em produção (HTTPS)
  sameSite: "lax", // Ou "lax", dependendo do comportamento desejado
  path: "/", // Disponível em todas as rotas
  maxAge: 30 * 24 * 60 * 60, // 30 dias para refreshToken
};
