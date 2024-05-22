import { Injectable, signal } from '@angular/core';
import { AbstractState } from '../core/states/abstract.state';
import { simpleStateFactory } from '../core/utils/factories/state.factory';

@Injectable({
  providedIn: 'root'
})
export class State extends AbstractState {

  app = simpleStateFactory();

  lang = signal('es');

  device = signal<{
    id: string,
    platform: string,
    osVersion: string,
    model: string,
    lang: string,
    pushNotificationToken?: string,
  } | undefined>(undefined);
}
