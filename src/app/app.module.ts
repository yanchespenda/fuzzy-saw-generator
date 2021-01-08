import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HomeComponent } from './components/home/home.component';
import { GenerateComponent } from './components/generate/generate.component';
import { CriteriaComponent } from './components/dialog/criteria/criteria.component';
import { AlternateComponent } from './components/dialog/alternate/alternate.component';
import { ConfirmComponent } from './components/dialog/confirm/confirm.component';
import { ValueComponent } from './components/dialog/value/value.component';

import { KatexModule } from 'ng-katex';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GenerateComponent,
    CriteriaComponent,
    AlternateComponent,
    ConfirmComponent,
    ValueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
    KatexModule,
    FormsModule,
    ReactiveFormsModule,

    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  entryComponents: [
    CriteriaComponent,
    AlternateComponent,
    ConfirmComponent,
    ValueComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
