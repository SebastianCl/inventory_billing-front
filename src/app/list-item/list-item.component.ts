import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Item } from '../models/item.model';
import { ItemService } from '../service/item.service';


@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  providers: [ItemService]
})
export class ListItemComponent implements OnInit {

  public listItem: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public itemService: ItemService) { }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data) {
    this.router.navigate(['/details-item', data.id]);
  }

  // Servicios
  getList(): any {
    this.itemService.loadItems()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataItem = {
              id: element.id,
              reference: element.reference,
              brand: element.brand
            }
            this.listItem.push(dataItem);
          });
        } else {
          this.alert('¡Aviso!', 'Sin registros.', 'warning');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('item');
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

  updateItem(id): any {
    Swal.fire(
      'Done!',
      'The quotation was passed to item order.',
      'success'
    )
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

}
