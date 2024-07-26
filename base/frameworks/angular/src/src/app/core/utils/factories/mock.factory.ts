import { environment } from "../../../../environments/environment";

export const simpleMockFactory = <T = any>(value: T) => {
  return !environment.production && environment.mock ? value : undefined;
};
