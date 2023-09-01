import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';
import { OccupancyComponent } from './occupancy/occupancy.component';

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'floorplan', component: FloorPlanComponent },
  { path: 'occupancy', component: OccupancyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
