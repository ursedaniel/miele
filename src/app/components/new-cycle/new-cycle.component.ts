import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { Device, Tariff, DeviceType } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-cycle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './new-cycle.component.html',
  styleUrls: ['./new-cycle.component.scss']
})
export class NewCycleComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<NewCycleComponent>);

  // Expose enums to template
  readonly DeviceType = DeviceType;

  cycleForm!: FormGroup;
  loading = signal(true);
  creating = signal(false);
  availableDevices = signal<Device[]>([]);
  tariffs = signal<Tariff[]>([]);

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  private initForm() {
    this.cycleForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      deviceId: ['', [Validators.required]]
    });
  }

  private loadData() {
    forkJoin({
      devices: this.apiService.getAvailableDevices(),
      tariffs: this.apiService.getTariffs()
    }).subscribe({
      next: ({ devices, tariffs }) => {
        this.availableDevices.set(devices);
        this.tariffs.set(tariffs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading.set(false);
      }
    });
  }

  get selectedDevice(): Device | undefined {
    const deviceId = this.cycleForm.get('deviceId')?.value;
    return this.availableDevices().find(device => device.id === deviceId);
  }

  getTariffForDevice(deviceId: string): Tariff | undefined {
    const device = this.availableDevices().find(d => d.id === deviceId);
    if (!device) return undefined;
    return this.tariffs().find(tariff => tariff.id === device.tariffId.toString());
  }

  getDeviceIcon(deviceType: DeviceType): string {
    return deviceType === DeviceType.WASHER ? 'local_laundry_service' : 'dry_cleaning';
  }

  getDeviceIconClass(deviceType: DeviceType): string {
    return deviceType === DeviceType.WASHER ? 'device-icon-washer' : 'device-icon-dryer';
  }

  onSubmit() {
    if (this.cycleForm.valid && !this.creating()) {
      this.creating.set(true);
      
      const formValue = this.cycleForm.value;
      const newCycle = {
        userId: formValue.userId,
        deviceId: formValue.deviceId,
        userAgent: navigator.userAgent
      };

      this.apiService.createCycle(newCycle).subscribe({
        next: (cycle) => {
          this.dialogRef.close(cycle);
        },
        error: (error) => {
          console.error('Error creating cycle:', error);
          this.creating.set(false);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}