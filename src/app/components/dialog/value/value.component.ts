import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  value?: number;
}

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {

  actionForm: FormGroup = this.formBuilder.group({
    value: [
      '', [Validators.required, Validators.min(0)]
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.actionForm.controls.value.setValue(data?.value ? data.value : 0);
  }

  onConfirm(): void {
    this.dialogRef.close({
      value: this.actionForm.controls.value.value,
    });
  }

  ngOnInit(): void {
  }

}
