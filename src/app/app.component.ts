import { Component, AfterViewChecked } from '@angular/core';
import { interval } from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  count$ = interval(1000);

  name = 'Static Name';
  name$ = this.count$.pipe(map(count => `Dynamic name ${count}`));

  ngAfterViewChecked() {
    console.log('AppComponent Checked');
  }

}
