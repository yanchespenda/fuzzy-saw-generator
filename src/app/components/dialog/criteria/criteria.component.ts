import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  mode?: string;
  code?: string;
  name?: string;
  weight?: number;
  type?: number;
}

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent implements OnInit {

  isEditMode = false;

  actionForm: FormGroup = this.formBuilder.group({
    code: [
      '', [Validators.required]
    ],
    name: [
      '', [Validators.required]
    ],
    weight: [
      '', [Validators.required, Validators.min(0), Validators.max(100)]
    ],
    type: [
      '', [Validators.required]
    ],
  });

  typeSelect = [
    {
      viewValue: 'Benefit',
      value: 1
    },
    {
      viewValue: 'Cost',
      value: 2
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CriteriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data?.mode && data.mode === 'edit') {
      this.isEditMode = true;
    }
    this.actionForm.controls.name.setValue(data?.name ? data.name : null);
    this.actionForm.controls.code.setValue(data?.code ? data.code : null);
    this.actionForm.controls.weight.setValue(data?.weight ? data.weight : null);
    this.actionForm.controls.type.setValue(data?.type ? data.type : 1);
  }

  onConfirm(): void {
    this.dialogRef.close({
      code: this.actionForm.controls.code.value,
      name: this.actionForm.controls.name.value,
      weight: this.actionForm.controls.weight.value,
      type: this.actionForm.controls.type.value
    });
  }

  ngOnInit(): void {
  }

}
