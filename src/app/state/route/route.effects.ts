import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouteActionTypes, RouteActions, RoutesLoaded, RoutesFailed, ShowSimpleMessage } from './route.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { RouteService } from '../../services/route.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../index';
import { getRouteQuery } from './route.selectors';
import { of } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { MessagingService } from '../../services/messaging.service';

@Injectable()
export class RouteEffects {

  @Effect()
  loadRoutes$ = this.actions$.pipe(
    ofType(RouteActionTypes.LoadRoutes),
    withLatestFrom(this.store$.pipe(select(getRouteQuery))),
    switchMap(([, settings]) => this.routeService.getIsochrones(settings).pipe(
      map(response => new RoutesLoaded({ response })),
      catchError(err => of(new RoutesFailed({ err })))
    ))
  );

  @Effect()
  routesSucceeded$ = this.actions$.pipe(
    ofType(RouteActionTypes.RoutesLoaded),
    map(() => new ShowSimpleMessage({ message: 'Routes loaded Successfully' }))
  );

  @Effect()
  routesFailed$ = this.actions$.pipe(
    ofType(RouteActionTypes.RoutesFailed),
    tap(action => console.error('There was an error requesting the route.', action.payload.err)),
    map(() => new ShowSimpleMessage({ message: 'Routing failed!' }))
  );

  @Effect({ dispatch: false })
  showMessage$ = this.actions$.pipe(
    ofType(RouteActionTypes.ShowSimpleMessage),
    tap(action => this.messaging.showMessage(action.payload.message))
  );

  constructor(private actions$: Actions<RouteActions>,
              private store$: Store<AppState>,
              private routeService: RouteService,
              private messaging: MessagingService) {}
}
