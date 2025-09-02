import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

// Components
import { CycleListComponent } from './components/cycle-list/cycle-list.component';
import { NewCycleComponent } from './components/new-cycle/new-cycle.component';

const routes: Routes = [
  {
    path: '',
    component: CycleListComponent
  }
];

@NgModule({
  declarations: [
    CycleListComponent,
    NewCycleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    
    // Angular Material
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    
    // Shared Module (contains CycleFilterComponent)
    SharedModule
  ]
})
export class CyclesModule { }