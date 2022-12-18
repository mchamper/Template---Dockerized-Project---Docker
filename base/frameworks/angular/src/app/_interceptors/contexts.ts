import { HttpContextToken } from "@angular/common/http";
import { StoreKey } from "../services/store.service";

export const AUTH_STORE_KEY = new HttpContextToken<StoreKey>(() => '_');
export const AUTH_LOGIN = new HttpContextToken<boolean>(() => false);
export const AUTH_UPDATE = new HttpContextToken<boolean>(() => false);
export const AUTH_LOGOUT_ON_ERROR = new HttpContextToken<boolean>(() => false);
