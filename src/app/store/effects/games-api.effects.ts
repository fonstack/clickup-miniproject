import { GamesApiService } from 'src/app/services/games-api.service';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect, concatLatestFrom } from '@ngrx/effects';
import * as GamesActions from '../actions/games.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class GamesApiEffects {
  constructor(private actions$: Actions, private gamesApiService: GamesApiService) { }

  getGamesEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamesActions.GET_GAMES_DATA),
      mergeMap((action) => {
        console.log('Geting Initial fetch');
        return this.gamesApiService.getGames({ sortProperty: action.sortProperty, sortType: action.sortType, page: action.page })
          .pipe(
            map(res => GamesActions.GAMES_DATA(res)),
            catchError(error => of(error))
          );
      })
    );
  });
}
