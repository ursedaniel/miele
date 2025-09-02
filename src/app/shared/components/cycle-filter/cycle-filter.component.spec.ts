import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { CycleFilterComponent } from './cycle-filter.component';
import { CycleStatus } from '../../../models';

describe('CycleFilterComponent', () => {
  let component: CycleFilterComponent;
  let fixture: ComponentFixture<CycleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CycleFilterComponent],
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CycleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to show all cycles', () => {
    expect(component.showAll).toBe(true);
    expect(component.selectedStatuses.length).toBe(0);
  });

  it('should emit filter change on initialization', () => {
    spyOn(component.filterChanged, 'emit');
    component.ngOnInit();
    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      selectedStatuses: [],
      showAll: true
    });
  });

  it('should update counts correctly', () => {
    const statusCounts = {
      [CycleStatus.IN_PROGRESS]: 2,
      [CycleStatus.COMPLETED]: 3
    };
    component.updateCounts(statusCounts, 5);
    
    expect(component.totalCount).toBe(5);
    expect(component.filterOptions[0].count).toBe(2); // IN_PROGRESS
    expect(component.filterOptions[1].count).toBe(3); // COMPLETED
  });

  it('should clear all filters', () => {
    component.selectedStatuses = [CycleStatus.COMPLETED];
    component.showAll = false;
    
    component.clearAllFilters();
    
    expect(component.showAll).toBe(true);
    expect(component.selectedStatuses.length).toBe(0);
  });
});
