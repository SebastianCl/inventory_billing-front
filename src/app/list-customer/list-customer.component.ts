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
              identification: element.identification,
              name: element.name,
              direction: element.direction,
              email: element.email,
              telephone1: element.telephone1,
              telephone2: element.telephone2,
              telephone3: element.telephone3,
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
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'Un error ha ocurrido.', 'error');
          }
        }
      );
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  public goToEdit(data) {
    let infoCustomer = {
      customerId: data.id,
      customerName: data.name,
      customerIdentificacion: data.identification,
      customerEmail: data.email,
      customerDirection: data.direction,
      customerTelephone1: data.telephone1,
      customerTelephone2: data.telephone2,
      customerTelephone3: data.telephone3,
    }
    localStorage.setItem('info-edit-customer', JSON.stringify(infoCustomer));
    this.router.navigate(['/edit-customer']);
  }

}
