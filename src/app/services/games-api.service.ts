import { RatingPipe } from './../pipes/rating.pipe';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/Game';

@Injectable({
  providedIn: 'root'
})
export class GamesApiService {
  itemsPerPage = 10;

  constructor(
    private http: HttpClient,
    private ratingPipe: RatingPipe,
  ) { }

  async getGames(
    sortProperty?: 'name' | 'rating',
    sortType?: 'asc' | 'desc', page?: number
  ): Promise<{ results: Game[], totalPages: number }> {
    const res = await this.http.get<any>(
      `https://api.rawg.io/api/games?key=1664eafef3fd4d29a6074b5a01229530&page_size=${this.itemsPerPage}&page=${page || 1}&ordering=${((sortType === 'asc' || !sortType) ? '' : '-') + (sortProperty || '')}`
    ).toPromise();
    return {
      results: res.results.map(r => ({
        id: r.id,
        name: r.name,
        rating: this.ratingPipe.transform(r.rating),
        playtime: r.playtime,
      })), totalPages: res.count
    };
  }
}
