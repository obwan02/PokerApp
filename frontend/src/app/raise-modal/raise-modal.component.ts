import { Component, NgIterable, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-raise-modal',
  templateUrl: './raise-modal.component.html',
  styleUrls: ['./raise-modal.component.less']
})
export class RaiseModalComponent implements OnInit {

  amount: number = 0;

  constructor(public dialogRef: MatDialogRef<RaiseModalComponent>, private stateService: StateService) { }

  ngOnInit(): void {
  }

  getRaiseOptions(): number[] {
    var numbers = [];
    var chips = this.stateService.currentPlayer()?.chips;

    if (!chips) {
      return [0];
    }

    for (let i=1; i<chips; i++) {
      numbers.push(i);
    }

    return numbers;
  }

  done() {
    this.dialogRef.close(this.amount);
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
