import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(rating: number, ...args: unknown[]): unknown {
    return `${rating * 2} / 10`;
  }

}
