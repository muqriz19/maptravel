import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './pages/map/map.component';

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'map',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
