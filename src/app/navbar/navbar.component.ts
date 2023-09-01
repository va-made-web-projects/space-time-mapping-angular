import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          { label: 'Map', icon: 'pi pi-fw pi-map', routerLink: 'map' },
          { label: 'Floor Plan', icon: 'pi pi-fw pi-calendar', routerLink: 'floorplan' },
          { label: 'Occupancy', icon: 'pi pi-fw pi pi-user', routerLink: 'occupancy' },
      ];
  }
}
