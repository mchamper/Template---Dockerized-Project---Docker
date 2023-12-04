export type THttpResponse<Body = any> = {
  status: number,
  message: string,
  body: Body,
}
