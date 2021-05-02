import { GamesApiService } from './services/games-api.service';
import { Component, OnInit } from '@angular/core';
import { ClickupTable } from './components/clickup-table/clickup-table.component';
import { Game } from './models/Game';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gamesData: { results: Game[], totalPages: number };
  loadingData = new BehaviorSubject<boolean>(false);
  tablePagination: { page: number, totalPages: number };
  dataTable: ClickupTable<Game>;

  constructor(
    private gamesApiService: GamesApiService
  ) { }

  async ngOnInit(): Promise<void> {
    this.gamesData = (await this.gamesApiService.getGames());
    this.tablePagination = { page: 1, totalPages: this.gamesData.totalPages };

    // Only name and rating can be sorted because the API only supports these properties :(
    // buuuut, in order to measure my knowledge I'll implement a comparator for those properties that
    // does not have sorting in backend (only will work for the 10 items showed in the moment of the sorting)
    this.dataTable = {
      tableColumns: [
        {
          title: 'ID', filter: true,
          comparatorDesc: (a: Game, b: Game) => b.id - a.id,
          comparatorAsc: (a: Game, b: Game) => a.id - b.id
        },
        { title: 'Name', filter: true },
        { title: 'Rating', filter: true },
        {
          title: 'Playtime', filter: true,
          comparatorDesc: (a: Game, b: Game) => b.playtime - a.playtime,
          comparatorAsc: (a: Game, b: Game) => a.playtime - b.playtime
        },
      ],
      tableBodyProperties: ['id', 'name', 'rating', 'playtime']
    };
  }

  async reorderTable(tableReorder: { property: 'name' | 'rating', sort: 'asc' | 'desc' }): Promise<void> {
    this.loadingData.next(true);
    this.gamesData = await this.gamesApiService.getGames(tableReorder?.property, tableReorder?.sort);
    this.loadingData.next(false);
    this.tablePagination = { page: 1, totalPages: this.gamesData.totalPages };
  }

  async changePage(changePage: { change: number, tableReorder: { property: 'name' | 'rating', sort: 'asc' | 'desc' } }): Promise<void> {
    this.loadingData.next(true);
    this.gamesData = await this.gamesApiService.getGames(
      changePage.tableReorder?.property, changePage.tableReorder?.sort,
      this.tablePagination.page + changePage.change,
    );
    this.loadingData.next(false);
    this.tablePagination = { page: this.tablePagination.page + changePage.change, totalPages: this.gamesData.totalPages };
  }
}
