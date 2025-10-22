import {
  EntityError,
  type EntityErrorPayload,
  HttpError,
  type HttpErrorPayload,
} from "@/lib/error";
import { authStorage } from "@/storage/features/auth.storage";
import { type LoginRes } from "@/types/auth.type";
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

type CustomOptions = Omit<RequestInit, "method"> & {
  responseType?: "json" | "blob" | "text";
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions = {}
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  const accessToken = authStorage.getAccessToken();
  if (accessToken) {
    baseHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const baseUrl = apiEndpoint;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as Record<string, string>,
    body,
    method,
  });

  let payload;
  if (options?.responseType === "blob") {
    payload = await res.blob();
  } else if (options?.responseType === "text") {
    payload = await res.text();
  } else {
    payload = await res.json();
  }

  const data = {
    status: res.status,
    payload: payload as Response,
  };
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (url.includes("auth/signin")) {
        throw new HttpError(
          data as { status: number; payload: HttpErrorPayload }
        );
      }
      if (!url.includes("auth/signin")) {
        authStorage.clear();
        location.href = "/login";
      } else {
        const sessionToken = (
          options?.headers as Record<string, string>
        )?.Authorization.split("Bearer ")[1];
        window.location.href = `/logout?sessionToken=${sessionToken}`;
      }
    } else {
      throw new HttpError(
        data as { status: number; payload: HttpErrorPayload }
      );
    }
  }

  const normalizeUrl = normalizePath(url);
  if (normalizeUrl === "auth/signin" || normalizeUrl === "auth/signup") {
    const { accessToken, account } = payload as LoginRes;
    authStorage.saveAuth(account, accessToken);
  } else if ("/auth/logout" === normalizeUrl) {
    localStorage.clear();
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
