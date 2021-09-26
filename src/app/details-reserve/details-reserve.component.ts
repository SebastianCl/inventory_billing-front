import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { ReserveService } from '../service/reserve.service';

@Component({
  selector: 'app-details-reserve',
  templateUrl: './details-reserve.component.html',
  styleUrls: ['./details-reserve.component.css'],
  providers: [ReserveService]
})
export class DetailsReserveComponent implements OnInit {

  public form: FormGroup;
  public cols: any;
  listArticlesLoads = [];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public reserveService: ReserveService) {
    this.createForm();
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-reserve']);
  }

  formatDate(strDate, isDetail: Boolean) {
    let date = new Date(strDate);
    let dmy = date.toLocaleDateString();

    let msgDate = dmy;
    // Si se solicita detalle se envia con hora y dia de la semana
    if (isDetail) {
      const days = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ];

      const numberDay = date.getDay();
      const nameDay = days[numberDay];

      let hour = date.toLocaleTimeString();
      msgDate = `${dmy} | ${nameDay} | ${hour}`;
    }
    return msgDate;
  }

  setData(data) {
    this.form.controls.reserveDay.setValue(this.formatDate(data.reserveDay, true));
    this.form.controls.startDate.setValue(this.formatDate(data.startDate, false));
    this.form.controls.endDate.setValue(this.formatDate(data.endDate, false));

    let invoiceNumber = data.invoiceNumber === 0 ? 'SIN FACTURAR' : data.invoiceNumber;
    this.form.controls.invoiceNumber.setValue(invoiceNumber);

    this.form.controls.reserveNumber.setValue(data.reserveNumber);
    this.form.controls.customerName.setValue(data.customerName);
    this.form.controls.employeName.setValue(data.employeeName);
    this.form.controls.description.setValue(data.description);
    this.listArticlesLoads = data.articles;
    let isActive = data.active ? 'ACTIVA' : 'CERRADA';
    this.form.controls.isActive.setValue(isActive);
  }

  getData(idReserve: string): any {
    this.reserveService.loadReserve(idReserve)
      .subscribe((response: any) => {
        this.setData(response.msg);
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeReserve('token');
            localStorage.removeReserve('user');
            Swal.fire({
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      );
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  public createForm() {

    this.form = new FormGroup({
      reserveNumber: new FormControl(''),
      startDate: new FormControl(''),
      invoiceNumber: new FormControl(''),
      customerName: new FormControl(''),
      employeName: new FormControl(''),
      reserveDay: new FormControl(''),
      endDate: new FormControl(''),
      description: new FormControl(''),
      isActive: new FormControl('')
    });
  }

}
