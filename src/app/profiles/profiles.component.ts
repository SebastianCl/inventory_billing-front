import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  boolRole = false;
  constructor(private router: Router) { }

  ngOnInit() {

    let jsonData = JSON.parse(localStorage.getItem('user'));
    let descRole = jsonData.role.role.toUpperCase();
    (descRole == "ADMINISTRADOR") ? this.boolRole = false : this.boolRole = true;

  }

  goToPage(url: string) {
    this.router.navigate([url]);
  }

}
