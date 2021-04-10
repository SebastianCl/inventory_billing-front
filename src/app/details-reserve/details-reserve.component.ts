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
    debugger;
    this.form.controls.reserveDay.setValue(data.reserveDay);
    this.form.controls.startDate.setValue(data.startDate);
    this.form.controls.endDate.setValue(data.endDate);
    this.form.controls.customerName.setValue('');
    this.form.controls.description.setValue(data.description);
    this.form.controls.articles.setValue(data.items.length);

    let isActive = data.iscative ? 'ACTIVA' : 'CERRADA';
    this.form.controls.isActive.setValue(isActive);
  }

  getData(idReserve: string): any {
    this.reserveService.loadReserve(idReserve)
      .subscribe((response: any) => {
        this.setData(response.msg.entityData);
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
      customerName: new FormControl(''),
      reserveDay: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      description: new FormControl(''),
      articles: new FormControl(''),
      isActive: new FormControl('')
    });
  }

}
