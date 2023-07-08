import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.less']
})
export class JoinComponent implements OnInit {

  host: string = '192.168.178.40:3000';
  name: string = '';
  chips: number = 100;

  constructor(private stateService: StateService, private router: Router) { }

  ngOnInit(): void {
  }

  join(): void {
    this.stateService.join(this.host, this.name, this.chips).subscribe(() => {
      this.router.navigate(['play']);
    });
  }

}
