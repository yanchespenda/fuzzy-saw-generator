import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KatexOptions } from 'ng-katex';
import { AlternateDataSource, CriteriaDataSource, SourceStep2, Step1List, Step2List, ValueSource } from 'src/app/interfaces';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent implements OnInit {

  criteriaDataSource: CriteriaDataSource[];
  alternateDataSource: AlternateDataSource[];
  valueSource: ValueSource[] = [];

  options: KatexOptions = {
    displayMode: true,
  };

  formulaStep1A: string = `\\frac{ x_{ ij } }{ max \\, x_{ ij } }`;
  formulaStep1B: string = `\\frac{ min \\, x_{ ij } }{ x_{ ij } }`;

  valueSourceStep1: ValueSource[] = [];
  step1List: Step1List[] = [];

  valueSourceStep2: SourceStep2[] = [];
  step2List: Step2List[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.runInit();
  }

  runInit(): void {
    const queryInitCriteria = this.activatedRoute.snapshot.queryParams?.criteriaData;
    const queryInitAlternate = this.activatedRoute.snapshot.queryParams?.alternateData;
    const queryInitValue = this.activatedRoute.snapshot.queryParams?.valueData;

    if (queryInitCriteria && queryInitAlternate && queryInitValue) {
      try {
        this.criteriaDataSource = JSON.parse(queryInitCriteria);
      } catch (error) {
        console.error('criteriaDataSource', error);
      }

      try {
        this.alternateDataSource = JSON.parse(queryInitAlternate);
      } catch (error) {
        console.error('alternateDataSource', error);
      }

      try {
        this.valueSource = JSON.parse(queryInitValue);
      } catch (error) {
        console.error('valueSource', error);
      }

      // console.group('QueryData');
      // console.info('criteriaDataSource', this.criteriaDataSource);
      // console.info('alternateDataSource', this.alternateDataSource);
      // console.info('valueSource', this.valueSource);
      // console.groupEnd();
    } else { }
  }

  valueGetLengthCriteria(): number {
    return this.criteriaDataSource.length + 1;
  }

  findRawValue(alternate: string, criteria: string): number {
    let value = 0;

    const getAlternateIndex = this.valueSource.findIndex(x => x.code === alternate);
    if (getAlternateIndex !== -1) {
      const getCriteriaIndex = this.valueSource[getAlternateIndex].list.findIndex(x => x.code === criteria);
      if (getCriteriaIndex !== -1) {
        value = this.valueSource[getAlternateIndex].list[getCriteriaIndex].value;
      }
    }
    return value;
  }

  findAlternate(alternate: string): number {
    return this.valueSourceStep2.findIndex(x => x.code === alternate);
  }

  findRawCriteria(criteria: string): number[] {
    let rawCriteria: number[] = [];
    this.valueSource.forEach(value => {
      const getCriteriaIndex = value.list.findIndex(x => x.code === criteria);
      if (getCriteriaIndex !== -1) {
        rawCriteria.push(value.list[getCriteriaIndex].value);
      }
    });
    return rawCriteria;
  }

  findWeightCriteria(criteria: string): number {
    const getIndex = this.criteriaDataSource.findIndex(x => x.code === criteria);
    if (getIndex !== -1) {
      return this.criteriaDataSource[getIndex].weight;
    }
    return 0;
  }

  runStep1(): void {
    let tempValue: ValueSource[] = [];
    this.alternateDataSource.forEach(alternate => {
      let criteriaList = [];
      this.criteriaDataSource.forEach(criteria => {
        const getAllCriteriaValue = this.findRawCriteria(criteria.code);
        const currentValue = this.findRawValue(alternate.code, criteria.code);
        let searchIdentity = 0;
        let latexText = ``;
        let result = 0;
        if (criteria.type === 1) {
          searchIdentity = Math.max(...getAllCriteriaValue);
          result = currentValue / searchIdentity;
          latexText = `\\frac{${currentValue}}{max \\, \\left \\{ ${getAllCriteriaValue.join(';')} \\right \\}} = \\frac{${currentValue}}{${searchIdentity}} = ${result}`;
        } else if (criteria.type === 2) {
          searchIdentity = Math.min(...getAllCriteriaValue);
          result = searchIdentity / currentValue;
          latexText = `\\frac{min \\, \\left \\{ ${getAllCriteriaValue.join(';')} \\right \\}}{${currentValue}} = \\frac{${searchIdentity}}{${currentValue}} = ${result}`;
        }
        const tempRaw = {
          rowName: `Row ${alternate.code}/${criteria.code}`,
          value: currentValue,
          result: result,
          latexText: latexText,
        };
        this.step1List.push(tempRaw);

        // Push Data To Step 2
        const getAlternateIndex = this.findAlternate(alternate.code);
        if (getAlternateIndex === -1) {
          this.valueSourceStep2.push({
            code: alternate.code,
            list: [
              {
                code: criteria.code,
                value: result
              }
            ]
          });
        } else {
          this.valueSourceStep2[getAlternateIndex].list.push({
            code: criteria.code,
            value: result
          });
        }

        criteriaList.push({
          code: criteria.code,
          value: result
        });
      });

      const tempAlternate = {
        code: alternate.code,
        list: criteriaList
      };
      tempValue.push(tempAlternate);
    });

    this.valueSourceStep1 = tempValue;
    // console.log('this.step1List', this.step1List);
  }

  runStep2(): void {
    console.log('this.valueSourceStep2', this.valueSourceStep2);
    this.valueSourceStep2.forEach(alternate => {
      let result = 0;
      let latextCriteria = [];
      alternate.list.forEach(criteria => {
        const getWeight = this.findWeightCriteria(criteria.code) / 100;
        const resultCriteria = getWeight * criteria.value;
        result += resultCriteria;
        latextCriteria.push(`\\left ( ${getWeight} \\, * \\, ${criteria.value} \\right )`);
      });

      const tempPush = {
        alternateName: `${alternate.code}`,
        result: result,
        latexText: `${latextCriteria.join(`\\, + \\,`)} \\, = \\, ${result}`
      };

      this.step2List.push(tempPush);
    });
    console.log('this.step2List', this.step2List);
  }

  ngOnInit(): void {
    this.runStep1();

    this.runStep2();
  }

}
