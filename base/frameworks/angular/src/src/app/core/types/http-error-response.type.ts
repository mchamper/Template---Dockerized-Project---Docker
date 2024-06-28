export type THttpErrorResponse = {
  status: number,
  message: string,
  body: any,
  name: string,
  exception: string,
  code: number,
  validation: any,
}

export type THttpErrorResponseKeys = {
  status?: string,
  message?: string,
  body?: string,
  name?: string,
  exception?: string,
  code?: string,
  validation?: string,
}
