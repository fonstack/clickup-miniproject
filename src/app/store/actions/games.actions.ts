import { createAction, props } from '@ngrx/store';
import { GamesData } from 'src/app/models/Game';

// Requests
export const GET_GAMES_DATA = createAction('[Get] API Get data',
  props<{ sortProperty?: 'name' | 'rating', sortType?: 'asc' | 'desc', page?: number }>()
);

// Responses
export const GAMES_DATA = createAction('[Response] API Get Data', props<GamesData>());
