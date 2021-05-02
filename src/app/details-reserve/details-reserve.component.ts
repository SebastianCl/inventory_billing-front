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


  setData(data) {
    console.info(data);
    this.form.controls.reserveNumber.setValue(data.reserveNumber);
    this.form.controls.startDate.setValue(data.startDate);
    this.form.controls.invoiceNumber.setValue(data.invoiceNumber);
    this.form.controls.customerName.setValue(data.customerName);
    this.form.controls.employeName.setValue(data.employeeName);
    this.form.controls.reserveDay.setValue(data.reserveDay);
    this.form.controls.endDate.setValue(data.endDate);
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
