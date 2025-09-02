import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../services/api.service';
import { CycleWithDetails, CycleStatus } from '../../../../models';
import { CycleFilterComponent } from '../../../../shared/components/cycle-filter/cycle-filter.component';
import { FilterOptions } from '../../../../shared/components/cycle-filter/cycle-filter.component';
import { Observable, map } from 'rxjs';
import { NewCycleComponent } from '../new-cycle/new-cycle.component';

@Component({
  selector: 'app-cycle-list',
  templateUrl: './cycle-list.component.html',
  standalone: false,
  styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent implements OnInit, AfterViewInit {
  @ViewChild(CycleFilterComponent) filterComponent!: CycleFilterComponent;
  
  cycles$!: Observable<CycleWithDetails[]>;
  filteredCycles$!: Observable<CycleWithDetails[]>;
  allCycles: CycleWithDetails[] = [];
  currentFilter: FilterOptions = { selectedStatuses: [], showAll: true };

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCycles();
  }

  ngAfterViewInit() {
    // Update filter counts after view is initialized
    if (this.allCycles.length > 0) {
      this.updateFilterCounts(this.allCycles);
    }
  }

  loadCycles() {
    this.cycles$ = this.apiService.getCyclesWithDetails();
    this.filteredCycles$ = this.cycles$;
    
    // Subscribe to get all cycles for filtering and count updates
    this.cycles$.subscribe(cycles => {
      this.allCycles = cycles;
      this.applyFilter(this.currentFilter);
      this.updateFilterCounts(cycles);
    });
  }

  onFilterChanged(filterOptions: FilterOptions) {
    this.currentFilter = filterOptions;
    this.applyFilter(filterOptions);
  }

  private applyFilter(filterOptions: FilterOptions) {
    if (filterOptions.showAll || filterOptions.selectedStatuses.length === 0) {
      this.filteredCycles$ = this.cycles$;
    } else {
      this.filteredCycles$ = this.cycles$.pipe(
        map(cycles => cycles.filter(cycle => 
          filterOptions.selectedStatuses.includes(cycle.status)
        ))
      );
    }
  }

  private updateFilterCounts(cycles: CycleWithDetails[]) {
    const statusCounts = cycles.reduce((acc, cycle) => {
      acc[cycle.status] = (acc[cycle.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Update the filter component counts
    if (this.filterComponent) {
      this.filterComponent.updateCounts(statusCounts, cycles.length);
    }
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

  trackByCycleId(index: number, cycle: CycleWithDetails): string {
    return cycle.id;
  }
}