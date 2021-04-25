import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'app/service/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.css']
})
export class ListInvoiceComponent implements OnInit {

  public listInvoices: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public invoiceService: InvoiceService) { }


  ngOnInit() {
    this.getList();
  }

  openModalInvoice() {
    const modalNewInvoice = document.getElementById('myModalNewInvoice');
    modalNewInvoice.style.display = 'block';
  }

  close() {
    const closeModalNewInvoice = document.getElementById('myModalNewInvoice');
    closeModalNewInvoice.style.display = 'none';
  }

  /*goToDetails(data) {
    this.router.navigate(['/details-invoice', data.id]);
  }*/

  deleteInvoice(idInvoice) {
    this.invoiceService.deleteInvoice(idInvoice)
      .subscribe((response: any) => {
        if (response.resp) {
          this.alert('Atención!', 'Se a eliminado la factura con exito.', 'success');
          this.getList()
        } else {
          this.alert('Warning', 'Se presento un error en el sistema.', 'warning');
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

  // Servicios
  getList(): any {
    this.invoiceService.loadInvoices()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataInvoice = {
              id: element.id,
              nameCustomer: element.customer.name,
              identificationCustomer: element.customer.identification,
              numberInvoice: element.invoiceNumber,
              numberReserve: element.reserveNumber,
              stateInvoice: element.active,
              description: element.description,
              totalInvoice: element.cost,
              depositInvoice: element.deposit,
              nameEmployee: element.employee.name
            }
            this.listInvoices = [... this.listInvoices, dataInvoice];
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

}
