import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RaiseModalComponent } from '../raise-modal/raise-modal.component';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.less']
})
export class PlayComponent implements OnInit {

  constructor(public stateService: StateService, private dialog: MatDialog) { }

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
    const dialogRef = this.dialog.open(RaiseModalComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;

      this.stateService.raise(result as number);
    });
  }

}
