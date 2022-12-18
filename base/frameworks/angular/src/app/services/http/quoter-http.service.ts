import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAP, RES } from 'src/app/interceptors/contexts';
import { Qualification, TQualificationStatus } from 'src/app/models/qualification';

@Injectable({
  providedIn: 'root',
})
export class QuoterHttpService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /* -------------------- */

  quote(input: any) {
    return this._httpClient.post(`api:/cotizador/individuo/cotizar`, input, {
      context: new HttpContext()
        .set(MAP, (res) => {
          const {
            cotizacion: { importe, alquiler, expensas, plazo, legales, facilidades_pago },
          } = res.body;

          return {
            quotation: {
              importe,
              alquiler,
              expensas,
              plazo,
              legales,
              facilidades: facilidades_pago.map((facilidad: any) => {
                return {
                  orden: facilidad.orden,
                  destacado: facilidad.destacado,
                  texto: facilidad.texto,
                  subTexto: facilidad.sub_texto,
                  precioTexto: facilidad.precio_texto,
                  infoTexto: facilidad.info_texto,
                  importe: facilidad.importe,
                };
              }),
            }
          };
        })
    });
  }

  qualify(input: any) {
    return this._httpClient.post(`api:/cotizador/individuo/calificar`, input, {
      context: new HttpContext()
        .set(RES, { body: '', message: 'message' })
        .set(MAP, (res) => {
          let status: TQualificationStatus;

          switch (res.body.message) {
            case 'Aprobado': status = 'APPROVED'; break;
            default: status = 'ERROR'; break;
          }

          return {
            qualification: new Qualification({
              applicantName: res?.body.payload.nombre || null,
              status: status,
            }),
          };
        })
    });
  }
}
