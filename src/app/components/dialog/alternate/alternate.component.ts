import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  mode?: string;
  code?: string;
  name?: string;
}

@Component({
  selector: 'app-alternate',
  templateUrl: './alternate.component.html',
  styleUrls: ['./alternate.component.scss']
})
export class AlternateComponent implements OnInit {

  isEditMode = false;

  actionForm: FormGroup = this.formBuilder.group({
    code: [
      '', [Validators.required]
    ],
    name: [
      '', [Validators.required]
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AlternateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data?.mode && data.mode === 'edit') {
      this.isEditMode = true;
    }
    this.actionForm.controls.name.setValue(data?.name ? data.name : null);
    this.actionForm.controls.code.setValue(data?.code ? data.code : null);
  }

  onConfirm(): void {
    this.dialogRef.close({
      code: this.actionForm.controls.code.value,
      name: this.actionForm.controls.name.value,
    });
  }

  ngOnInit(): void {
  }

}
