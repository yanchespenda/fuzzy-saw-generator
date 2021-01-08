import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title?: string;
  content?: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  title: string;
  content: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.title = data?.title ? data.title : 'Delete Confirm';
    this.content = data?.content ? data.content : 'Are you sure to delete this data?';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  ngOnInit(): void {
  }

}
