import { GamesApiEffects } from './store/effects/games-api.effects';
import { GamesApiService } from './services/games-api.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClickupTableComponent } from './components/clickup-table/clickup-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingPipe } from './pipes/rating.pipe';
import { StoreModule } from '@ngrx/store';
import { gamesReducer } from './store/reducers/games.reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    ClickupTableComponent,
    RatingPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot({ games: gamesReducer }),
    EffectsModule.forRoot([GamesApiEffects]),
  ],
  providers: [GamesApiService, RatingPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
