import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
  providers: [UserService]
})
export class ListUserComponent implements OnInit {

  public listUser: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public userService: UserService) { }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data) {
    this.router.navigate(['/details-user', data.id]);
  }


  // Servicios
  getList(): any {
    this.userService.loadUsers()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataUser = {
              id: element.id,
              firstname: element.firstname,
              lastname: element.lastname
            }
            this.listUser.push(dataUser);
          });
        } else {
          this.alert('Warning', 'No records.', 'warning');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              title: 'Session expired', text: 'You must log.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'An error happened.', 'error');
          }
        }
      );
  }

  updateUser(id): any {
    Swal.fire(
      'Done!',
      'The quotation was passed to customer order.',
      'success'
    )
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

}
