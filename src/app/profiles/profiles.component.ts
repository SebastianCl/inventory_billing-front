import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToPage(url: string) {
    this.router.navigate([url]);
  }

}
