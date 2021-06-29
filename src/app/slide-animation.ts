import { trigger, transition, style, query, animateChild, animate, group } from '@angular/animations';

export const SlideInAnimation = trigger('routeAnimations', [
  transition('* => details', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          paddingTop: '48px',
          position: 'absolute',
          top: '-4px',
          left: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '100%' }))], { optional: true }),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true })
  ]),
  transition('details => *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          paddingTop: '48px',
          position: 'absolute',
          top: '-4px',
          right: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ right: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('300ms ease-out', style({ right: '100%' }))], { optional: true }),
      query(':enter', [animate('300ms ease-out', style({ right: '0%' }))], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true })
  ])
]);
