export type THttpResponse<Body = any> = {
  status: number,
  message: string,
  body: Body,
}

export type THttpResponseKeys = {
  status?: string,
  message?: string,
  body?: string,
}
