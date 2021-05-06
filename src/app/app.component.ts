import { GamesApiService } from './services/games-api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClickupTable } from './components/clickup-table/clickup-table.component';
import { Game, GamesData } from './models/Game';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Ngrx
import * as gamesActions from './store/actions/games.actions';
import { select, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<boolean>();

  gamesData$: Observable<GamesData>;
  loadingData = new BehaviorSubject<boolean>(false);
  tablePagination: { page: number, totalPages: number };
  dataTable: ClickupTable<Game>;

  constructor(private store: Store<{ games: GamesData }>) { }

  ngOnInit(): void {
    this.gamesData$ = this.store.pipe(select('games'));
    this.store.dispatch(gamesActions.GET_GAMES_DATA({}));
    this.gamesData$.pipe(takeUntil(this.destroyed$)).subscribe(gamesData => {
      console.log('State ->', gamesData);
      this.loadingData.next(false);
      this.tablePagination = { page: gamesData?.actualPage, totalPages: gamesData?.totalPages };
    });

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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  reorderTable(tableReorder: { property: 'name' | 'rating', sort: 'asc' | 'desc' }): void {
    this.loadingData.next(true);
    this.store.dispatch(gamesActions.GET_GAMES_DATA({ sortProperty: tableReorder?.property, sortType: tableReorder?.sort }));
  }

  changePage(changePage: { change: number, tableReorder: { property: 'name' | 'rating', sort: 'asc' | 'desc' } }): void {
    this.loadingData.next(true);
    this.store.dispatch(gamesActions.GET_GAMES_DATA({
      sortProperty: changePage.tableReorder?.property,
      sortType: changePage.tableReorder?.sort,
      page: this.tablePagination.page + changePage.change,
    }));
  }
}
