import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as GamesActions from '../actions/games.actions';

import { GamesData } from '../../models/Game';

const defaultState: GamesData = null;

const _gamesReducer = createReducer(
  defaultState,
  on(GamesActions.GAMES_DATA, (state, gamesData) => ({
    results: gamesData.results,
    totalPages: gamesData.totalPages,
    actualPage: gamesData.actualPage
  }))
);

export function gamesReducer(state: GamesData, action: Action): GamesData {
  return _gamesReducer(state, action);
}




