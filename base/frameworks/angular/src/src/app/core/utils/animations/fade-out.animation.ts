import { animate, state, style, transition, trigger } from "@angular/animations"

export const fadeOutAnimation = () => {
  return trigger('fadeOutAnimation', [
    state('in', style({ opacity: 1 })),
    transition(':enter', animate(300, style({ opacity: 1 }))),
    transition(':leave', animate(300, style({ opacity: 0 }))),
  ]);
}
