import { animate, style, transition, trigger } from "@angular/animations"

export const fadeOutAnimation = () => {
  return trigger('fadeOutAnimation', [
    transition(':enter', [
      style({ opacity: '1' }),
    ]),
    transition(':leave', [
      style({ opacity: '1' }),
      animate('200ms', style({ opacity: '0' })),
    ])
  ]);
}

export const fadeInOutAnimation = () => {
  return trigger('fadeInOutAnimation', [
    transition(':enter', [
      style({ opacity: '0' }),
      animate('200ms', style({ opacity: '1' })),
    ]),
    transition(':leave', [
      style({ opacity: '1' }),
      animate('200ms', style({ opacity: '0' })),
    ])
  ]);
}
