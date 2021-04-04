import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { Item } from '../models/item.model';
import { ItemService } from '../service/item.service';

@Component({
  selector: 'app-item-profile',
  templateUrl: './item-profile.component.html',
  styleUrls: ['./item-profile.component.css'],
  providers: [ItemService]
})
export class ItemProfileComponent implements OnInit {

  item: Item;

  type: FormControl;

  reference: FormControl;
  brand: FormControl;
  color: FormControl;
  size: FormControl;

  comments: FormControl;
  price: FormControl;
  quantity: FormControl;
  available: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  public dataEventFileValid: any = null;

  constructor(public itemService: ItemService, private _snackBar: MatSnackBar) {
    this.type = new FormControl();
    this.reference = new FormControl();
    this.brand = new FormControl();
    this.color = new FormControl();
    this.size = new FormControl();
    this.comments = new FormControl();
    this.price = new FormControl();
    this.quantity = new FormControl();
    this.available = new FormControl();
    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  async encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log('RESULT', reader.result)
    }
    reader.readAsDataURL(file);
  }

  async uploadFile(imageArray) {
    this.dataEventFileValid = null;
    debugger;
    if (imageArray.length > 0) {
      this.alert('Atención', 'Subiendo imágenes, un momento por favor...', 'warning');

      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      let data = await toBase64(imageArray[0]);

      //this.item.image = data;




      await this.itemService
        .uploadImage(this.item)
        .then((resp) => {
          debugger;
          this.alert('¡Atención!', 'ENVIADO', 'success');
        })
        .catch((err) => {
          debugger;
          if (err.status === 401) {
            this.alert('¡Atención!', err.error.msg + +' STATUS' + err.status, 'warning');
          } else {
            this.alert('¡Atención!', err.error.msg, 'warning');
          }
        });


    }
    else {
      this.alert('Atención!', 'Debes seleccionar al menos una imágen para continuar.', 'warning');
    }
  }


  ngOnInit() { }

  private clearData() {
    this.type.setValue('');
    this.reference.setValue('');
    this.brand.setValue('');
    this.color.setValue('');
    this.size.setValue('');
    this.comments.setValue('');
    this.price.setValue('');
    this.quantity.setValue('');
    this.available.setValue(false);
  }

  create() {
    this.changeShow();
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    this.save();
  }

  private save() {
    this.dsbSave = true;
    this.item = new Item;
    this.item.type = this.type.value;
    this.item.reference = this.reference.value;
    this.item.brand = this.brand.value;
    this.item.color = this.color.value;
    this.item.size = this.size.value;
    this.item.comments = this.comments.value;
    this.item.available = this.available.value;
    this.item.price = this.price.value;
    this.item.quantity = this.quantity.value;

    this.itemService.createItem(this.item)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Item creado.', 'success');
          this.clearData();
        } else {
          this.alert('Atención', 'Item no creado.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Fallo al crear Item.', 'error');
        }
      );
  }

  private validateData() {
    if (this.type.value === null || this.type.value === '') {
      this.openSnackBar('Debes indicar el tipo.', 'HECHO');
      return false;
    }
    if (this.reference.value === null || this.reference.value === '') {
      this.openSnackBar('Debes indicar la referencia.', 'HECHO');
      return false;
    }
    if (this.brand.value === null || this.brand.value === '') {
      this.openSnackBar('Debes indicar la marca.', 'HECHO');
      return false;
    }
    if (this.color.value === null || this.color.value === '') {
      this.openSnackBar('Debes indicar el color.', 'HECHO');
      return false;
    }
    if (this.size.value === null || this.size.value === '') {
      this.openSnackBar('Debes indicar el tamaño.', 'HECHO');
      return false;
    }
    if (this.comments.value === null || this.comments.value === '') {
      this.openSnackBar('Debes indicar el comentario.', 'HECHO');
      return false;
    }
    if (this.price.value === null || this.price.value === '') {
      this.openSnackBar('Debes indicar el precio.', 'HECHO');
      return false;
    }
    if (this.available.value === null || this.available.value === '') {
      this.openSnackBar('Debes indicar si esta disponible.', 'HECHO');
      return false;
    }
    return true;
  }

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }
  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }


}

