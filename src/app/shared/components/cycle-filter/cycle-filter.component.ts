import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CycleStatus } from '../../../models';

export interface FilterOptions {
  selectedStatuses: CycleStatus[];
  showAll: boolean;
}

@Component({
  selector: 'app-cycle-filter',
  standalone: false,
  templateUrl: './cycle-filter.component.html',
  styleUrls: ['./cycle-filter.component.scss']
})
export class CycleFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<FilterOptions>();

  readonly CycleStatus = CycleStatus;
  
  showAll = true;
  selectedStatuses: CycleStatus[] = [];

  filterOptions = [
    { 
      status: CycleStatus.IN_PROGRESS, 
      label: 'In Progress', 
      icon: 'play_circle', 
      color: '#2196F3',
      count: 0,
      selected: false 
    },
    { 
      status: CycleStatus.COMPLETED, 
      label: 'Completed', 
      icon: 'check_circle', 
      color: '#4CAF50',
      count: 0,
      selected: false 
    },
    { 
      status: CycleStatus.CANCELLED, 
      label: 'Cancelled', 
      icon: 'cancel', 
      color: '#FF9800',
      count: 0,
      selected: false 
    },
    { 
      status: CycleStatus.FAILURE, 
      label: 'Failed', 
      icon: 'error', 
      color: '#F44336',
      count: 0,
      selected: false 
    }
  ];

  totalCount = 0;

  ngOnInit() {
    this.emitFilterChange();
  }

  onShowAllChange() {
    if (this.showAll) {
      this.filterOptions.forEach(option => option.selected = false);
      this.selectedStatuses = [];
    }
    this.emitFilterChange();
  }

  onStatusChange(option: any) {
    if (option.selected) {
      this.showAll = false;
      if (!this.selectedStatuses.includes(option.status)) {
        this.selectedStatuses.push(option.status);
      }
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== option.status);
      
      if (this.selectedStatuses.length === 0) {
        this.showAll = true;
      }
    }
    this.emitFilterChange();
  }

  removeStatus(statusToRemove: CycleStatus) {
    this.selectedStatuses = this.selectedStatuses.filter(s => s !== statusToRemove);
    const option = this.filterOptions.find(opt => opt.status === statusToRemove);
    if (option) {
      option.selected = false;
    }
    
    if (this.selectedStatuses.length === 0) {
      this.showAll = true;
    }
    this.emitFilterChange();
  }

  getStatusLabel(status: CycleStatus): string {
    const option = this.filterOptions.find(opt => opt.status === status);
    return option ? option.label : status;
  }

  clearAllFilters() {
    this.showAll = true;
    this.selectedStatuses = [];
    this.filterOptions.forEach(option => option.selected = false);
    this.emitFilterChange();
  }

  private emitFilterChange() {
    this.filterChanged.emit({
      selectedStatuses: this.selectedStatuses,
      showAll: this.showAll
    });
  }

  updateCounts(statusCounts: { [key: string]: number }, total: number) {
    this.totalCount = total;
    this.filterOptions.forEach(option => {
      option.count = statusCounts[option.status] || 0;
    });
  }

  get activeFiltersCount(): number {
    return this.selectedStatuses.length;
  }

  get hasActiveFilters(): boolean {
    return !this.showAll && this.selectedStatuses.length > 0;
  }
}