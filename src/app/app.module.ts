import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';
import { OccupancyComponent } from './occupancy/occupancy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule } from 'primeng/tabmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { MapModalComponent } from './map/map-modal/map-modal.component';
import { DeskModalComponent } from './map/desk-modal/desk-modal.component';

import { SpaceImageComponent } from './map/map-modal/space-image/space-image.component';
import { DeskHourImageComponent } from './map/desk-modal/desk-hour-image/desk-hour-image.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    FloorPlanComponent,
    OccupancyComponent,
    MapModalComponent,
    SpaceImageComponent,
    DeskModalComponent,
    DeskHourImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    BadgeModule,
    ChipModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
