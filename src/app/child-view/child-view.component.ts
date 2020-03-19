import { Component, OnInit } from '@angular/core';
import {interval} from 'rxjs'

@Component({
  selector: 'app-child-view',
  template: `
    <div> a = {{ a$ | asyncInnerCheck }} </div>
  `,
  styleUrls: ['./child-view.component.css']
})
export class ChildViewComponent implements OnInit {

  a$ = interval(1000);

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    console.log('ChildViewComponent Checked');
  }
}
