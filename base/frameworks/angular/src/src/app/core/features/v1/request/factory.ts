import { of } from "rxjs";
import { Request } from "./classes/request.class";

export const createRequest = <
  GBody = unknown,
  GParams = { [key: string]: unknown },
>(
  config: Request<GBody, GParams>['_config'],
  options?: Request['_options'],
) => new Request<GBody, GParams>(config, options);

export const createDefaultRequest = <
  GBody = unknown,
  GParams = { [key: string]: unknown },
>(
  config?: Omit<Request<GBody, GParams>['_config'], 'send'>,
  options?: Request['_options'],
) => new Request<GBody, GParams>({ ...config, send: () => of()}, options);
