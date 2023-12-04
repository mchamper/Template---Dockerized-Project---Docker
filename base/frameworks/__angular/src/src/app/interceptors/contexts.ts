import { HttpContextToken } from "@angular/common/http";
import { TGuard } from "../services/auth.service";
import { IHttpResponse } from "./success.interceptor";
import { IHttpErrorResponse } from "./error.interceptor";

export const GUARD = new HttpContextToken<TGuard | null>(() => null);
export const FALLBACK_GUARD = new HttpContextToken<TGuard | null>(() => null);
export const MAP = new HttpContextToken<((res: IHttpResponse) => any) | null>(() => null);
export const ON_SUCCESS = new HttpContextToken<((res: IHttpResponse) => () => any) | null>(() => null);
export const ON_ERROR = new HttpContextToken<((res: IHttpErrorResponse) => () => any) | null>(() => null);
export const ERR_AS_200 = new HttpContextToken<((res: IHttpResponse) => boolean) | null>(() => null);
