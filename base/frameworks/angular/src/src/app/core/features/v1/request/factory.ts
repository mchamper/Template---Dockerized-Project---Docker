import { of } from "rxjs";
import { Request } from "./classes/request.class";

export const createRequest = <
  GBody = any,
  GParams = { [key: string]: any },
>(
  config: Request<GBody, GParams>['_config'],
  options?: Request['_options'],
) => new Request<GBody, GParams>(config, options);

export const createDefaultRequest = <
  GBody = any,
  GParams = { [key: string]: any },
>(
  config?: Omit<Request<GBody, GParams>['_config'], 'send'>,
  options?: Request['_options'],
) => new Request<GBody, GParams>({ ...config, send: () => of()}, options);
