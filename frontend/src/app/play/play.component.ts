import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.less']
})
export class PlayComponent implements OnInit {

  constructor(public stateService: StateService) { }

  ngOnInit(): void {
  }

  start(): void {
    this.stateService.start()
  }

  fold(): void {
    this.stateService.fold();
  }

  call(): void {
    this.stateService.call();
  }

  raise(): void {
    var amount = prompt('Raise amount');
    this.stateService.raise(parseInt(amount || '0'));
  }

}
