import { environment } from "../../../../environments/environment";

export const logger = (message: string, ...params: any) => {
  if (!environment.production) {
    console.log(`DEBUG --- ${message}`, ...params);
  }
}
