import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.less']
})
export class JoinComponent implements OnInit {

  name: string = '';
  chips: number = 100;

  constructor() { }

  ngOnInit(): void {
  }

  join(): void {
    // todo
  }

}
