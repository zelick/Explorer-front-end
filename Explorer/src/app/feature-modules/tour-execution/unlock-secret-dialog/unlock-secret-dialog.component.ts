import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  checkpointName: string;
  unlocked: boolean;
}

@Component({
  selector: 'xp-unlock-secret-dialog',
  templateUrl: './unlock-secret-dialog.component.html',
  styleUrls: ['./unlock-secret-dialog.component.css']
})
export class UnlockSecretDialogComponent {
  constructor(public dialogRef: MatDialogRef<UnlockSecretDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
