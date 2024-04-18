import { Injectable, signal } from '@angular/core';
import { AbstractState } from '../core/states/abstract.state';
import { simpleStateFactory } from '../core/utils/factories/state.factory';

@Injectable({
  providedIn: 'root'
})
export class State extends AbstractState {

  app = simpleStateFactory();

  lang = signal('es');
}
