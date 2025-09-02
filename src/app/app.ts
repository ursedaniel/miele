import { Component } from '@angular/core';
import { CycleListComponent } from './components/cycle-list/cycle-list.component';

@Component({
  selector: 'app-root',
  imports: [CycleListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
}