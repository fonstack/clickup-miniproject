import { RatingPipe } from './../pipes/rating.pipe';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game, GamesData } from '../models/Game';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesApiService {
  itemsPerPage = 10;

  constructor(
    private http: HttpClient,
    private ratingPipe: RatingPipe,
  ) { }

  getGames(data: { sortProperty?: 'name' | 'rating', sortType?: 'asc' | 'desc', page?: number }): Observable<GamesData> {
    return this.http.get<any>(
      `https://api.rawg.io/api/games?key=1664eafef3fd4d29a6074b5a01229530&page_size=${this.itemsPerPage}&page=${data.page || 1}&ordering=${((data.sortType === 'asc' || !data.sortType) ? '' : '-') + (data.sortProperty || '')}`
    ).pipe(
      map(res => ({
        results: res.results.map(r => ({
          id: r.id,
          name: r.name,
          rating: this.ratingPipe.transform(r.rating),
          playtime: r.playtime,
        })), totalPages: res.count,
        actualPage: data.page || 1,
      }))
    );
  }
}
