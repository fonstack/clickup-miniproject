export interface Game {
  id: number;
  name: string;
  rating: number;
  playtime: number;
}

export interface GamesData {
  results: Game[];
  actualPage: number;
  totalPages: number;
}
