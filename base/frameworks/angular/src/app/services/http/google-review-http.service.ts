import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shuffle, take } from 'lodash';
import { MOCK, RES_MAP } from 'src/app/interceptors/contexts';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';
import { googleReviewsMock } from 'src/app/mocks/google-reviews.mock';

type TGet = IHttpResponse<
  typeof googleReviewsMock,
  {
    comments: {
      body: string,
      name: string,
      stars: number,
      starsFullArray: any[],
      starsEmptyArray: any[],
    }[],
    averageRating: number,
  }
>;

@Injectable({
  providedIn: 'root',
})
export class GoogleReviewHttpService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /* -------------------- */

  get() {
    return this._httpClient.get<TGet>(``, {
      context: new HttpContext()
        .set(MOCK, googleReviewsMock)
        .set(RES_MAP, (res: TGet) => {
          const comments = res.body.reviews.filter(review => {
            return !!review.comment?.trim()
              && !!review.reviewer?.displayName?.trim()
              && ['FIVE'].includes(review.starRating)
              ;
          });

          const commentsMapped = take(shuffle(comments), 3).map(review => {
            let stars: number;

            switch(review.starRating) {
              case 'FIVE': stars = 5; break;
              case 'FOUR': stars = 4; break;
              case 'THREE': stars = 3; break;
              case 'TWO': stars = 2; break;
              case 'ONE': stars = 1; break;

              default: stars = 0; break;
            }

            const commentSplitted = review.comment?.split('(Original)') || [];
            const comment: string = commentSplitted[1] || commentSplitted[0];

            return {
              body: comment.trim(),
              name: review.reviewer.displayName.trim(),
              stars: stars,
              starsFullArray: Array(stars),
              starsEmptyArray: Array(5 - stars),
            }
          });

          return {
            comments: commentsMapped,
            averageRating: res.body.averageRating
          }
        })
    });
  }
}
