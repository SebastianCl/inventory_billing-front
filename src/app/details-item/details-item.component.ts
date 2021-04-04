import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { ItemService } from '../service/item.service';

@Component({
  selector: 'app-details-item',
  templateUrl: './details-item.component.html',
  styleUrls: ['./details-item.component.css'],
  providers: [ItemService]
})
export class DetailsItemComponent implements OnInit {

  public form: FormGroup;
  public cols: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public itemService: ItemService) {
    this.createForm();
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-item']);
  }


  setData(data) {
    debugger;
    this.form.controls.reference.setValue(data.reference);
    this.form.controls.type.setValue(data.type);
    this.form.controls.comments.setValue(data.comments);
    this.form.controls.quantity.setValue(data.quantity);
    this.form.controls.color.setValue(data.color);
    this.form.controls.size.setValue(data.size);
    this.form.controls.price.setValue(data.price);
  }

  getData(idItem: string): any {
    this.itemService.loadItem(idItem)
      .subscribe((response: any) => {
        this.setData(response.msg.entityData);
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
      reference: new FormControl(''),
      type: new FormControl(''),
      comments: new FormControl(''),
      quantity: new FormControl(''),
      color: new FormControl(''),
      size: new FormControl(''),
      price: new FormControl('')
    });
  }

}
