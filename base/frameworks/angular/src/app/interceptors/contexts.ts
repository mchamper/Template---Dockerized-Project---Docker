import { HttpContextToken } from "@angular/common/http";
import { IAuthLoginContext, TGuard } from "../services/auth.service";
import { IHttpErrorResponse } from "./error.interceptor";
import { IHttpResponse } from "./success.interceptor";

export const URL_ORIGINAL = new HttpContextToken<string | null>(() => null);
export const URL = new HttpContextToken<'api' | 'backend' | null>(() => null);
export const RES = new HttpContextToken<{ body?: string, message?: string } | null>(() => null);
export const RES_MAP = new HttpContextToken<((res: IHttpResponse) => any) | null>(() => null);
export const ERR = new HttpContextToken<{ body?: string, message?: string, errors?: string } | null>(() => null);
export const ERR_AS_200 = new HttpContextToken<((err: IHttpErrorResponse) => boolean) | null>(() => null);
export const AUTH_GUARD = new HttpContextToken<TGuard | null>(() => null);
export const AUTH_LOGIN = new HttpContextToken<IAuthLoginContext | null>(() => null);
export const AUTH_UPDATE = new HttpContextToken<IAuthLoginContext | null>(() => null);
export const AUTH_LOGOUT_ON_ERROR = new HttpContextToken<boolean>(() => false);
