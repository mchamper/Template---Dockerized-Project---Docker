import { cloneDeep, upperFirst } from "lodash";
import { camelize } from "src/app/helper";

export abstract class BaseModel<Data> {

  readonly data: Data;
  readonly raw: any;

  constructor(data: any, parserMethod?: string) {
    this.raw = cloneDeep(data);
    data = camelize(data);

    if (parserMethod && !data._isParsed) {
      data = (this as any)[`parseFrom${upperFirst(parserMethod)}`](data);
      data._isParsed = true;
    }

    this.data = data;
  }
}
