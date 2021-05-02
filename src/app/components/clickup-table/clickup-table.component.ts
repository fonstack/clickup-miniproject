import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GamesApiService } from 'src/app/services/games-api.service';

export interface ClickupTable<T> {
  tableColumns: {
    title: string;
    filter: boolean;
    comparatorDesc?: any;
    comparatorAsc?: any;
  }[];
  tableBodyProperties?: string[];
  tableBody?: Array<T>;
  tablePagination?: { page: number, totalPages: number };
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'clickup-table',
  templateUrl: './clickup-table.component.html',
  styleUrls: ['./clickup-table.component.scss']
})
export class ClickupTableComponent<T> implements OnInit {
  @Input() tableColumns: { title: string, filter: boolean, comparator?: any, width?: number }[];
  @Input() tableBodyProperties: string[];
  @Input() tableBody: Array<T>;
  @Input() tablePagination: { page: number, totalPages: number };
  @Input() tableSorting: { property: string, sort: 'asc' | 'desc' };
  @Output() doReorder = new EventEmitter<{ property: string, sort: 'asc' | 'desc' }>();
  @Output() doChangePage = new EventEmitter<{ change: number, tableReorder: { property: string, sort: 'asc' | 'desc' } }>();
  // Yeaaah! I use so often rxjs for things like this
  @Input() tableLoading: BehaviorSubject<boolean>;

  // Other funcs
  mouse: { x: number, y: number };
  columnBeingResized: { idx: number, width: number, left: number };

  constructor(
    public gamesApiService: GamesApiService
  ) { }

  ngOnInit(): void {

  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouse = { x: event.clientX, y: event.clientY };
    if (this.columnBeingResized) { this.resize(); }
  }

  resize(): void {
    this.tableColumns[this.columnBeingResized.idx].width =
      this.mouse.x >= this.columnBeingResized.left ?
        ((this.mouse.x - this.columnBeingResized.left) + this.columnBeingResized.width) :
        (this.columnBeingResized.width - (this.columnBeingResized.left - this.mouse.x));
    this.tableColumns[this.columnBeingResized.idx].width =
      this.tableColumns[this.columnBeingResized.idx].width >= 120 ?
        this.tableColumns[this.columnBeingResized.idx].width :
        120;
    // this.tableColumns = [...this.tableColumns];
  }

  setResizing(event: MouseEvent, colIdx: number): void {
    this.columnBeingResized = { idx: colIdx, width: (event as any).path[2].offsetWidth, left: event.clientX };
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tableColumns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.tableBodyProperties, event.previousIndex, event.currentIndex);
  }

  reorder(bodyProperty: string, column?: any): void {
    if (column.filter && !column.comparatorDesc && !column.comparatorAsc) {
      if (this.tableSorting?.property === bodyProperty && this.tableSorting?.sort === 'asc') {
        this.tableSorting = { property: bodyProperty, sort: 'desc' };
      } else if (this.tableSorting?.property === bodyProperty && this.tableSorting?.sort === 'desc') {
        this.tableSorting = null;
      } else {
        this.tableSorting = { property: bodyProperty, sort: 'asc' };
      }

      this.doReorder.emit(this.tableSorting);
    } else if (column.filter && column.comparatorAsc && column.comparatorDesc) {
      if (this.tableSorting?.property === bodyProperty && this.tableSorting?.sort === 'asc') {
        this.tableSorting = { property: bodyProperty, sort: 'desc' };
        this.tableBody.sort(column.comparatorDesc);
      } else if (this.tableSorting?.property === bodyProperty && this.tableSorting?.sort === 'desc') {
        this.tableSorting = null;
      } else {
        this.tableSorting = { property: bodyProperty, sort: 'asc' };
        this.tableBody.sort(column.comparatorAsc);
      }
    }
  }

  changePage(change: number): void {
    if (this.tablePagination.page !== 1 || change !== -1) {
      this.doChangePage.emit({ change, tableReorder: this.tableSorting });
    }
  }
}
