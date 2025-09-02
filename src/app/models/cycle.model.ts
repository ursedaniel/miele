import { CycleStatus } from './enums';

export interface InvoiceLine {
  name: string;
  totalPrice: number;
  currency: string;
}

export interface Cycle {
  id: string;
  startedAt: string;
  stoppedAt: string | null;
  status: CycleStatus;
  userId: string;
  userAgent: string;
  deviceId: string;
  invoiceLines: InvoiceLine[];
}
