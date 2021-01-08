import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CriteriaDataSource, AlternateDataSource, ValueSource, ValueSourceList } from 'src/app/interfaces';
import { AlternateComponent } from '../dialog/alternate/alternate.component';
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { CriteriaComponent } from '../dialog/criteria/criteria.component';
import { ValueComponent } from '../dialog/value/value.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  criteriaDisplayedColumns: string[] = ['code', 'name', 'type', 'weight', 'actions'];
  criteriaDataSource: MatTableDataSource<CriteriaDataSource>;

  alternateDisplayedColumns: string[] = ['code', 'nameAlternate', 'actions'];
  alternateDataSource: MatTableDataSource<AlternateDataSource>;

  valueSource: ValueSource[] = [];

  constructor(
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) { }

  criteriaToolbarNew(): void {
    if (this.criteriaWeightValidation(0, true)) {
      this.matSnackBar.open('Criteria weight was exceed 100', 'Close', {duration: 5000});
      return;
    }
    const dialogRef = this.matDialog.open(CriteriaComponent, {data: {mode: 'add'}});
      dialogRef.afterClosed().subscribe((result: CriteriaDataSource) => {
        if (result) {
          if (this.criteriaCodeDuplicate(result)) {
            this.matSnackBar.open('Criteria code has been used', 'Close', {duration: 5000});
            return;
          }
          this.criteriaDataUpdate(result);
        }
      });
    return;
  }

  criterialWeightCurrent(): number {
    let currentWeight = 0;
    if (this.criteriaDataSource.data.length > 0) {
      this.criteriaDataSource.data.forEach(criteria => {
        currentWeight += criteria.weight;
      })
    }
    return currentWeight;
  }

  criteriaWeightValidation(addWeight: number = 0, checkFull: boolean = false): boolean {
    let currentWeight = this.criterialWeightCurrent() +  addWeight;
    return checkFull ? currentWeight === 100 : currentWeight <= 100;
  }

  criteriaWeightValidationAfterAction(newWeight: number, beforeWeight: number = 0): boolean {
    return this.criteriaWeightValidation(newWeight - beforeWeight);
  }

  criteriaDataUpdate(criteria: CriteriaDataSource, criteriaUpdate: CriteriaDataSource = null): void {
    if (criteriaUpdate === null) {
      if (!this.criteriaWeightValidationAfterAction(criteria.weight)) {
        this.matSnackBar.open('Criteria weight was exceed 100', 'Close', {duration: 5000});
        return;
      }
      this.criteriaDataSource.data.push(criteria);
    } else {
      if (criteriaUpdate.weight < criteria.weight) {
        if (!this.criteriaWeightValidationAfterAction(criteria.weight, criteriaUpdate.weight)) {
          this.matSnackBar.open('Criteria weight was exceed 100', 'Close', {duration: 5000});
          return;
        }
      }
      criteriaUpdate.type = criteria.type;
      criteriaUpdate.code = criteria.code;
      criteriaUpdate.name = criteria.name;
      criteriaUpdate.weight = criteria.weight;
    }
    
    this.criteriaDataSource._updateChangeSubscription();
    this.valueComponentUpdate();
  }

  criteriaCodeDuplicate(criteria: CriteriaDataSource): boolean {
    return this.criteriaDataSource.data.findIndex(x => x.code === criteria.code) !== -1;
  }

  criteriaDelete(element: CriteriaDataSource): void {
    this.criteriaDataSource.data.splice(this.criteriaDataSource.data.findIndex(x => x.code === element.code), 1);
    this.criteriaDataSource._updateChangeSubscription();
  }

  criteriaTableAction(element: CriteriaDataSource, action: string): void {
    if (action === 'edit') {
      const dialogRef = this.matDialog.open(CriteriaComponent, {data: {
        mode: 'edit',
        code: element.code,
        name: element.name,
        weight: element.weight,
        type: element.type
      }});
      dialogRef.afterClosed().subscribe((result: CriteriaDataSource) => {
        if (result) {
          if (element.code !== result.code && this.criteriaCodeDuplicate(result)) {
            this.matSnackBar.open('Criteria code has been used', 'Close', {duration: 5000});
            return;
          }
          this.criteriaDataUpdate(result, element);
        }
      });
      return;
    } else if (action === 'delete') {
      const dialogRef = this.matDialog.open(ConfirmComponent, {data: {
        content: 'Are you sure to delete this criteria?',
      }});
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.criteriaDelete(element);
          this.valueComponentUpdate();
        }
      });
      return;
    }

    return;
  }

  criteriaType(element: CriteriaDataSource): string {
    return element.type === 1 ? 'Benefit' : 'Cost';
  }


  /* Alternate */

  alternateToolbarNew(): void {
    const dialogRef = this.matDialog.open(AlternateComponent, {data: {mode: 'add'}});
      dialogRef.afterClosed().subscribe((result: AlternateDataSource) => {
        if (result) {
          if (this.alternateCodeDuplicate(result)) {
            this.matSnackBar.open('Alternate code has been used', 'Close', {duration: 5000});
            return;
          }
          this.alternateDataUpdate(result);
        }
      });
    return;
  }

  alternateDataUpdate(criteria: AlternateDataSource, criteriaUpdate: AlternateDataSource = null): void {
    if (criteriaUpdate === null) {
      this.alternateDataSource.data.push(criteria);
    } else {
      criteriaUpdate.code = criteria.code;
      criteriaUpdate.name = criteria.name;
    }
    
    this.alternateDataSource._updateChangeSubscription();
    this.valueComponentUpdate();
  }

  alternateCodeDuplicate(criteria: AlternateDataSource): boolean {
    return this.alternateDataSource.data.findIndex(x => x.code === criteria.code) !== -1;
  }

  alternateDelete(element: AlternateDataSource): void {
    this.alternateDataSource.data.splice(this.alternateDataSource.data.findIndex(x => x.code === element.code), 1);
    this.alternateDataSource._updateChangeSubscription();
  }

  alternateTableAction(element: AlternateDataSource, action: string): void {
    if (action === 'edit') {
      const dialogRef = this.matDialog.open(AlternateComponent, {data: {
        mode: 'edit',
        code: element.code,
        name: element.name,
      }});
      dialogRef.afterClosed().subscribe((result: AlternateDataSource) => {
        if (result) {
          if (element.code !== result.code && this.alternateCodeDuplicate(result)) {
            this.matSnackBar.open('Alternate code has been used', 'Close', {duration: 5000});
            return;
          }
          this.alternateDataUpdate(result, element);
        }
      });
      return;
    } else if (action === 'delete') {
      const dialogRef = this.matDialog.open(ConfirmComponent, {data: {
        content: 'Are you sure to delete this alternate?',
      }});
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.alternateDelete(element);
          this.valueComponentUpdate();
        }
      });
      return;
    }

    return;
  }

  /* Value */
  valueGetLengthCriteria(): number {
    return this.criteriaDataSource.data.length + 1;
  }

  valueComponentUpdate(): void {
    let tempValue: ValueSource[] = [];
    this.alternateDataSource.data.forEach(alternate => {
      let criteriaList = [];
      this.criteriaDataSource.data.forEach(criteria => {
        criteriaList.push({
          code: criteria.code,
          value: 0 //Math.floor(Math.random() * 1001) // 0
        })
      });
      const tempAlternate = {
        code: alternate.code,
        list: criteriaList
      };
      tempValue.push(tempAlternate);
    });
    this.valueSource = tempValue;
    return;
  }

  valueEdit(element: ValueSourceList): void {
    const dialogRef = this.matDialog.open(ValueComponent, {
      data: {value: element.value},
    });
      dialogRef.afterClosed().subscribe((result: ValueSourceList) => {
        if (result) {
          element.value = result.value;
        }
      });
    return;
  }

  valueGenerate(): void {

    const criteriaData = JSON.stringify(this.criteriaDataSource.data);
    const alternateData = JSON.stringify(this.alternateDataSource.data);
    const valueData = JSON.stringify(this.valueSource);

    this.router.navigate([`/generate`],
      {
        queryParams: {
          criteriaData,
          alternateData,
          valueData,
        }
      }
    );
  }

  ngOnInit(): void {
    /* const tempDataSource: CriteriaDataSource[] = [
      {
        code: 'C1',
        name: 'Tes pengetahuan',
        weight: 35,
        type: 1,
      },
      {
        code: 'C2',
        name: 'Praktik instalasi jarignan',
        weight: 25,
        type: 1,
      },
      {
        code: 'C3',
        name: 'Tes atitude',
        weight: 25,
        type: 1,
      },
      {
        code: 'C4',
        name: 'Tes kepribadian',
        weight: 15,
        type: 1,
      },
    ]; */
    this.criteriaDataSource = new MatTableDataSource([]);

    /* const tempDataAlternate: AlternateDataSource[] = [
      {
        code: 'A1',
        name: 'Kurosaki'
      },
      {
        code: 'A2',
        name: 'Mea'
      },
      {
        code: 'A3',
        name: 'Klee'
      },
      {
        code: 'A4',
        name: 'Barbara'
      },
    ]; */
    this.alternateDataSource = new MatTableDataSource([]);

    this.valueComponentUpdate();
  }

}
