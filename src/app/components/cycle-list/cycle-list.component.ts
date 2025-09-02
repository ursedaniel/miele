import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { CycleWithDetails, CycleStatus } from '../../models';
import { Observable } from 'rxjs';
import { NewCycleComponent } from '../new-cycle/new-cycle.component';

@Component({
  selector: 'app-cycle-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './cycle-list.component.html',
  styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  
  cycles$!: Observable<CycleWithDetails[]>;

  ngOnInit() {
    this.loadCycles();
  }

  loadCycles() {
    this.cycles$ = this.apiService.getCyclesWithDetails();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getStatusDisplay(status: CycleStatus): string {
    switch (status) {
      case CycleStatus.IN_PROGRESS: 
        return 'In Progress';
      case CycleStatus.COMPLETED: 
        return 'Completed';
      case CycleStatus.CANCELLED: 
        return 'Cancelled';
      case CycleStatus.FAILURE: 
        return 'Failed';
      default: 
        return status;
    }
  }

  getStatusClass(status: CycleStatus): string {
    switch (status) {
      case CycleStatus.IN_PROGRESS: 
        return 'status-in-progress';
      case CycleStatus.COMPLETED: 
        return 'status-completed';
      case CycleStatus.CANCELLED: 
        return 'status-cancelled';
      case CycleStatus.FAILURE: 
        return 'status-failure';
      default: 
        return '';
    }
  }

  onStartNewCycle() {
    const dialogRef = this.dialog.open(NewCycleComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCycles(); // Refresh the list
      }
    });
  }

  onEndCycle(cycleId: string) {
    this.apiService.endCycle(cycleId).subscribe({
      next: () => {
        this.loadCycles(); // Refresh the list
      },
      error: (error) => {
        console.error('Error ending cycle:', error);
      }
    });
  }

  canEndCycle(status: CycleStatus): boolean {
    return status === CycleStatus.IN_PROGRESS;
  }
}