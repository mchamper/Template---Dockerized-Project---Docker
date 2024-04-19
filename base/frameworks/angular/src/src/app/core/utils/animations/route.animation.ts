import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const routeSlideRightAnimation = () => {
  return trigger('routeSlideRightAnimation', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        })
      ], { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate('300ms ease', style({ transform: 'translateX(0%)' })),
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('300ms ease', style({ transform: 'translateX(100%)', opacity: 0 })),
        ], { optional: true }),
      ]),
    ])
  ]);
};

export const routeSlideLeftAnimation = () => {
  return trigger('routeSlideLeftAnimation', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        })
      ], { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('300ms ease', style({ transform: 'translateX(0%)' })),
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('300ms ease', style({ transform: 'translateX(-100%)', opacity: 0 })),
        ], { optional: true }),
      ]),
    ])
  ]);
};

export const routeSlideUpAnimation = () => {
  return trigger('routeSlideUpAnimation', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        })
      ], { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateY(100%)' }),
          animate('400ms ease', style({ transform: 'translateY(0%)' })),
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateY(0%)' }),
          animate('400ms ease', style({ transform: 'translateY(-100%)', opacity: 0 })),
        ], { optional: true }),
      ]),
    ])
  ]);
};
