import getTokensAction from "@/features/autenticacao/actions/cookies/get-tokens-action";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  isAxiosError,
} from "axios";

import { ZodSchema } from "zod";

import saveTokensAction from "@/features/autenticacao/actions/cookies/save-tokens-action";

import isServer from "../utils/is-server";
import { UnauthenticatedError } from "../errors/errors";
import {
  AuthTokens,
  authTokensSchema,
} from "@/features/autenticacao/models/auth-tokens";

export const api = {
  get: get,
  post: post,
  put: put,
  delete: del,
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
}

export function axiosInstance({
  withoutRetry = false,
  headers = {},
}: {
  withoutRetry?: boolean;
  headers?: Record<string, string>;
}): AxiosInstance {
  const instance = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    timeout: 5000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (withoutRetry) return instance;

  instance.interceptors.response.use(
    (response) => response, // sucesso
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { refreshToken: refreshTokenStored } = await getTokensAction();
          if (!refreshTokenStored) {
            return Promise.reject(error);
          }
          const tokens: AuthTokens = await refreshToken(refreshTokenStored);
          await saveTokensAction({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });

          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${tokens.accessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${tokens.accessToken}`;

          processQueue(null, tokens.accessToken);
          return instance(originalRequest);
        } catch (error: any) {
          processQueue(error, null);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

interface RequestParams<TResponse = any, TData = any> {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: TData;
  queryParams?: Map<string, string | string[]>;
  headers?: Record<string, string>;
  schema?: ZodSchema<TResponse>;
  rawResponse?: boolean;
  withoutRetry?: boolean;
}

async function request<TResponse = any, TData = any>({
  endpoint,
  method,
  data,
  queryParams,
  headers,
  schema,
  rawResponse = false,
  withoutRetry = false,
}: RequestParams<TResponse, TData>): Promise<
  TResponse | AxiosResponse<TResponse>
> {
  try {
    if (queryParams) {
      const params = new URLSearchParams();
      queryParams.forEach((values, key) => {
        if (Array.isArray(values)) {
          values.forEach((value) => params.append(key, value));
        } else {
          params.append(key, values);
        }
      });

      endpoint += `?${params.toString()}`;
    }

    const { accessToken } = await getTokens();

    const authHeaders = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const api = await axiosInstance({ withoutRetry: withoutRetry });

    const response: AxiosResponse<TResponse> = await api.request<TResponse>({
      method,
      url: endpoint,
      data,
      headers: {
        ...headers,
        ...authHeaders,
      },
    });

    if (schema) {
      const resultado = schema.safeParse(response.data);
      if (!resultado.success) {
        throw new Error("Resposta da API inválida.");
      }

      return rawResponse
        ? { ...response, data: resultado.data }
        : resultado.data;
    }

    return rawResponse ? response : response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("Erro inesperado na requisição");
  }
}

// Métodos HTTP que utilizam a função request
async function get<TResponse = any>(
  endpoint: string,
  queryParams?: Map<string, string | string[]>,
  config?: Omit<RequestParams<TResponse>, "endpoint" | "method" | "data">
) {
  return request<TResponse>({
    endpoint,
    method: "GET",
    queryParams,
    ...config,
  });
}

async function post<TResponse = any, TData = any>(
  endpoint: string,
  data?: TData,
  config?: Omit<RequestParams<TResponse, TData>, "endpoint" | "method" | "data">
) {
  return request<TResponse, TData>({
    endpoint,
    method: "POST",
    data,
    ...config,
  });
}

async function put<TResponse = any, TData = any>(
  endpoint: string,
  data?: TData,
  config?: Omit<RequestParams<TResponse, TData>, "endpoint" | "method" | "data">
) {
  return request<TResponse, TData>({
    endpoint,
    method: "PUT",
    data,
    ...config,
  });
}

async function del<TResponse = any>(
  endpoint: string,
  config?: Omit<RequestParams<TResponse>, "endpoint" | "method" | "data">
) {
  return request<TResponse>({
    endpoint,
    method: "DELETE",
    ...config,
  });
}

async function getTokens(): Promise<{
  accessToken?: string;
  refreshToken?: string;
}> {
  if (isServer()) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    return {
      accessToken: cookieStore.get("accessToken")?.value,
      refreshToken: cookieStore.get("refreshToken")?.value,
    };
  } else {
    return await getTokensAction();
  }
}

export async function refreshToken(refreshToken: string): Promise<AuthTokens> {
  try {
    const tokens = (await api.post<AuthTokens, { refreshToken: string }>(
      `/autenticacao/refresh-token`,
      { refreshToken },
      { schema: authTokensSchema, withoutRetry: true }
    )) as AuthTokens;

    return tokens;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new UnauthenticatedError();
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/autenticacao/logout", {
    method: "POST",
  });
  if (!isServer()) {
    window.location.href = "/login";
  }
}
