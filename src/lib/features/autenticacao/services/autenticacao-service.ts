import { api } from "@/lib/api/api";

import axios from "axios";
import { AuthTokens } from "../models/auth-tokens";

export const autenticacaoService = {
  async login(tokens: AuthTokens): Promise<void> {
    try {
      const payload = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXT_API_BASE_URL}/autenticacao/login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error: any) {
      throw error;
    }
  },
  async logout(): Promise<void> {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXT_API_BASE_URL}/autenticacao/logout`,
        undefined,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error: any) {
      throw error;
    }
  },
};
