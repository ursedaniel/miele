import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';

import { CycleListComponent } from './cycle-list.component';
import { ApiService } from '../../../../services/api.service';
import { SharedModule } from '../../../../shared/shared.module';
import { CycleStatus, DeviceType } from '../../../../models';

describe('CycleListComponent', () => {
  let component: CycleListComponent;
  let fixture: ComponentFixture<CycleListComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockCycles = [
    {
      id: '1',
      startedAt: '2024-01-01T10:00:00Z',
      stoppedAt: null,
      status: CycleStatus.IN_PROGRESS,
      userId: 'test',
      userAgent: 'test-agent',
      deviceId: '1',
      invoiceLines: [],
      device: { id: '1', name: 'Test Washer', type: DeviceType.WASHER, tariffId: 1 },
      tariff: { id: '1', name: 'Test Tariff', price: 3.50, currency: 'EUR' }
    }
  ];

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCyclesWithDetails', 'endCycle']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CycleListComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatChipsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CycleListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    apiService.getCyclesWithDetails.and.returnValue(of(mockCycles));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cycles on init', () => {
    component.ngOnInit();
    expect(apiService.getCyclesWithDetails).toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    const dateString = '2024-01-01T10:00:00Z';
    const formatted = component.formatDate(dateString);
    expect(formatted).toContain('2024');
  });

  it('should get correct status display', () => {
    expect(component.getStatusDisplay(CycleStatus.IN_PROGRESS)).toBe('In Progress');
    expect(component.getStatusDisplay(CycleStatus.COMPLETED)).toBe('Completed');
  });

  it('should determine if cycle can be ended', () => {
    expect(component.canEndCycle(CycleStatus.IN_PROGRESS)).toBe(true);
    expect(component.canEndCycle(CycleStatus.COMPLETED)).toBe(false);
  });

  it('should open new cycle dialog', () => {
    const dialogRef = { afterClosed: () => of(null) };
    dialog.open.and.returnValue(dialogRef as any);
    
    component.onStartNewCycle();
    expect(dialog.open).toHaveBeenCalled();
  });
});