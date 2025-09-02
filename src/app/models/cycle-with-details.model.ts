import { Cycle } from './cycle.model';
import { Device } from './device.model';
import { Tariff } from './tariff.model';

export interface CycleWithDetails extends Cycle {
  device?: Device;
  tariff?: Tariff;
}