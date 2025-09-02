import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../services/api.service';
import { Device, Tariff, DeviceType } from '../../../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-cycle',
  standalone: false,
  templateUrl: './new-cycle.component.html',
  styleUrls: ['./new-cycle.component.scss']
})
export class NewCycleComponent implements OnInit {
  readonly DeviceType = DeviceType;

  cycleForm!: FormGroup;
  loading = true;
  creating = false;
  availableDevices: Device[] = [];
  tariffs: Tariff[] = [];

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewCycleComponent>
  ) {}

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
        this.availableDevices = devices;
        this.tariffs = tariffs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  get selectedDevice(): Device | undefined {
    const deviceId = this.cycleForm.get('deviceId')?.value;
    return this.availableDevices.find(device => device.id === deviceId);
  }

  getTariffForDevice(deviceId: string): Tariff | undefined {
    const device = this.availableDevices.find(d => d.id === deviceId);
    if (!device) return undefined;
    return this.tariffs.find(tariff => tariff.id === device.tariffId.toString());
  }

  getDeviceIcon(deviceType: DeviceType): string {
    return deviceType === DeviceType.WASHER ? 'local_laundry_service' : 'dry_cleaning';
  }

  getDeviceIconClass(deviceType: DeviceType): string {
    return deviceType === DeviceType.WASHER ? 'device-icon-washer' : 'device-icon-dryer';
  }

  onSubmit() {
    if (this.cycleForm.valid && !this.creating) {
      this.creating = true;
      
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
          this.creating = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}