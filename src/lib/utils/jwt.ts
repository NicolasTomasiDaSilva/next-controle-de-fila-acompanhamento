import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  exp?: number;
  [key: string]: any;
};

export function jwtIsValid(token?: string): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (!decoded.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
}
