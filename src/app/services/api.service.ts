import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Cycle, Device, Tariff, CreateCycle, CycleWithDetails, CycleStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  // Basic CRUD operations that work with json-server
  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`${this.baseUrl}/cycles`);
  }

  getCycle(id: string): Observable<Cycle> {
    return this.http.get<Cycle>(`${this.baseUrl}/cycles/${id}`);
  }

  // json-server will automatically generate an ID and add the new cycle
  createCycle(cycle: CreateCycle): Observable<Cycle> {
    const newCycle = {
      ...cycle,
      startedAt: new Date().toISOString(),
      stoppedAt: null,
      status: CycleStatus.IN_PROGRESS,
      invoiceLines: []
    };
    return this.http.post<Cycle>(`${this.baseUrl}/cycles`, newCycle);
  }

  // End a cycle by updating its status and stoppedAt time
  endCycle(cycleId: string): Observable<Cycle> {
    const updateData = {
      stoppedAt: new Date().toISOString(),
      status: CycleStatus.COMPLETED
    };
    return this.http.patch<Cycle>(`${this.baseUrl}/cycles/${cycleId}`, updateData);
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}/devices`);
  }

  getTariffs(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(`${this.baseUrl}/tariffs`);
  }

  // Combined method to get cycles with device and tariff information
  getCyclesWithDetails(): Observable<CycleWithDetails[]> {
    return forkJoin({
      cycles: this.getCycles(),
      devices: this.getDevices(),
      tariffs: this.getTariffs()
    }).pipe(
      map(({ cycles, devices, tariffs }) => {
        return cycles.map(cycle => {
          const device = devices.find(d => d.id === cycle.deviceId);
          const tariff = device ? tariffs.find(t => t.id === device.tariffId.toString()) : undefined;
          return {
            ...cycle,
            device,
            tariff
          } as CycleWithDetails;
        });
      })
    );
  }

  // Get available devices (not currently in use by in-progress cycles)
  getAvailableDevices(): Observable<Device[]> {
    return forkJoin({
      cycles: this.getCycles(),
      devices: this.getDevices()
    }).pipe(
      map(({ cycles, devices }) => {
        // Find devices that are currently busy (have in-progress cycles)
        const busyDeviceIds = cycles
          .filter(cycle => cycle.status === CycleStatus.IN_PROGRESS)
          .map(cycle => cycle.deviceId);
        
        // Return devices that are not in the busy list
        return devices.filter(device => !busyDeviceIds.includes(device.id));
      })
    );
  }

  // Get devices with their tariff information
  getDevicesWithTariffs(): Observable<(Device & { tariff?: Tariff })[]> {
    return forkJoin({
      devices: this.getDevices(),
      tariffs: this.getTariffs()
    }).pipe(
      map(({ devices, tariffs }) => {
        return devices.map(device => ({
          ...device,
          tariff: tariffs.find(t => t.id === device.tariffId.toString())
        }));
      })
    );
  }
}