import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  
})
export class SidebarComponent {
  isActive: boolean = false;
  isActiveMessagerie: boolean = false;
  isActiveVisioConferences: boolean = false;

  toggleSidebar(){
    this.isActive = !this.isActive
  }

  toggleMessagerie() {
    this.isActiveMessagerie = !this.isActiveMessagerie;
    this.isActiveVisioConferences = false;
  }

  toggleVisioConferences() {
    this.isActiveVisioConferences = !this.isActiveVisioConferences;
    this.isActiveMessagerie = false;
  }
}

