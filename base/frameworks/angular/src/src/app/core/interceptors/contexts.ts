import { HttpContextToken } from "@angular/common/http";
import { TAuthGuardName } from "../services/abstract-auth.service";
import { THttpResponse } from "../types/http-response.type";
import { THttpErrorResponse } from "../types/http-error-response.type";

export const GUARD = new HttpContextToken<TAuthGuardName | null>(() => null);
export const FALLBACK_GUARD = new HttpContextToken<TAuthGuardName | null>(() => null);
export const BODY_KEYS = new HttpContextToken<{ status?: string, body?: string, message?: string } | null>(() => null);
export const MAP = new HttpContextToken<((res: THttpResponse) => any) | null>(() => null);
export const MAP_MESSAGE = new HttpContextToken<((res: THttpResponse | THttpErrorResponse) => string) | null>(() => null);
export const ON_SUCCESS = new HttpContextToken<((res: THttpResponse) => () => any) | null>(() => null);
export const ON_ERROR = new HttpContextToken<((err: THttpErrorResponse) => () => any) | null>(() => null);
export const ERR_AS_200 = new HttpContextToken<((res: THttpResponse) => boolean) | null>(() => null);
