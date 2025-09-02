import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NewCycleComponent } from './new-cycle.component';
import { ApiService } from '../../../../services/api.service';
import { DeviceType } from '../../../../models';

describe('NewCycleComponent', () => {
  let component: NewCycleComponent;
  let fixture: ComponentFixture<NewCycleComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<NewCycleComponent>>;

  const mockDevices = [
    { id: '1', name: 'Test Washer', type: DeviceType.WASHER, tariffId: 1 }
  ];

  const mockTariffs = [
    { id: '1', name: 'Test Tariff', price: 3.50, currency: 'EUR' }
  ];

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getAvailableDevices', 'getTariffs', 'createCycle']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [NewCycleComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCycleComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<NewCycleComponent>>;

    apiService.getAvailableDevices.and.returnValue(of(mockDevices));
    apiService.getTariffs.and.returnValue(of(mockTariffs));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    component.ngOnInit();
    expect(component.cycleForm).toBeDefined();
    expect(component.cycleForm.get('userId')?.hasError('required')).toBe(true);
    expect(component.cycleForm.get('deviceId')?.hasError('required')).toBe(true);
  });

  it('should load devices and tariffs', () => {
    component.ngOnInit();
    expect(apiService.getAvailableDevices).toHaveBeenCalled();
    expect(apiService.getTariffs).toHaveBeenCalled();
  });

  it('should get correct device icon', () => {
    expect(component.getDeviceIcon(DeviceType.WASHER)).toBe('local_laundry_service');
    expect(component.getDeviceIcon(DeviceType.DRYER)).toBe('dry_cleaning');
  });

  it('should get tariff for device', () => {
    component.availableDevices = mockDevices;
    component.tariffs = mockTariffs;
    
    const tariff = component.getTariffForDevice('1');
    expect(tariff?.name).toBe('Test Tariff');
  });

  it('should cancel dialog', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    component.ngOnInit();
    component.onSubmit();
    expect(apiService.createCycle).not.toHaveBeenCalled();
  });
});