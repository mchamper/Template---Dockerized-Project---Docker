import { HttpContextToken } from "@angular/common/http";
import { TAuthGuardName } from "../services/abstract-auth.service";
import { THttpResponse, THttpResponseKeys } from "../types/http-response.type";
import { THttpErrorResponse, THttpErrorResponseKeys } from "../types/http-error-response.type";

export const GUARD = new HttpContextToken<TAuthGuardName | null>(() => null);
export const FALLBACK_GUARD = new HttpContextToken<TAuthGuardName | null>(() => null);
export const SUCCESS_KEYS = new HttpContextToken<THttpResponseKeys | null >(() => null);
export const ERROR_KEYS = new HttpContextToken<THttpErrorResponseKeys | null>(() => null);
export const MAP_BODY = new HttpContextToken<((res: THttpResponse) => any) | null>(() => null);
export const MAP_MESSAGE = new HttpContextToken<((res: THttpResponse | THttpErrorResponse) => string) | null>(() => null);
export const ON_SUCCESS = new HttpContextToken<((res: THttpResponse) => () => any) | null>(() => null);
export const ON_ERROR = new HttpContextToken<((err: THttpErrorResponse) => () => any) | null>(() => null);
export const ON_ERROR_401 = new HttpContextToken<((err: THttpErrorResponse) => () => any) | null>(() => null);
export const ERR_AS_SUCCESS = new HttpContextToken<((res: THttpResponse) => boolean) | null>(() => null);
