import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.less']
})
export class JoinComponent implements OnInit {

  host: string = '';
  name: string = '';
  chips: number = 100;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
  }

  join(): void {
    this.stateService.join(this.host, this.name, this.chips);
  }

}
