import { DeviceType } from './enums';

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  tariffId: number;
}