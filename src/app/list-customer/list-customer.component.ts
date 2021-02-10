import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../service/customer.service';


@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css'],
  providers: [CustomerService]
})
export class ListCustomerComponent implements OnInit {

  public listCustomer: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public customerService: CustomerService) { }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data) {
    this.router.navigate(['/details-customer', data.id]);
  }

  // Servicios
  getList(): any {
    this.customerService.loadCustomers()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataCustomer = {
              id: element.id,
              firstname: element.firstname,
              lastname: element.lastname
            }
            this.listCustomer.push(dataCustomer);
          });
        } else {
          this.alert('Warning', 'No records.', 'warning');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('customer');
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

  updateCustomer(id): any {
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
