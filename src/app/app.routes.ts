import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      redirectTo: '/cycles',
      pathMatch: 'full'
    },
    {
      path: 'cycles',
      loadChildren: () => import('./features/cycles/cycles.module').then(m => m.CyclesModule)
    }
  ];