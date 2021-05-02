import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { Article } from '../models/article.model';
import { ArticleService } from '../service/article.service';

@Component({
  selector: 'app-article-profile',
  templateUrl: './article-profile.component.html',
  styleUrls: ['./article-profile.component.css'],
  providers: [ArticleService]
})
export class ArticleProfileComponent implements OnInit {

  article: Article;

  type: FormControl;

  reference: FormControl;
  brand: FormControl;
  color: FormControl;
  size: FormControl;

  comments: FormControl;
  price: FormControl;
  quantity: FormControl;
  available: FormControl;
  base64Data: string;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  public dataEventFileValid: any = null;

  constructor(public articleService: ArticleService, private _snackBar: MatSnackBar) {
    this.base64Data = null;
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

  uploadFile(event) {

    const readers = new FileReader();
    const dataFile = event[0];

    // console.info(dataFile);

    readers.readAsDataURL(dataFile);
    readers.onload = () => {
        let resultBase64 = readers.result.toString();
        this.base64Data = resultBase64.split(',')[1];
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
    this.article = new Article;
    this.article.type = this.type.value;
    this.article.reference = this.reference.value;
    this.article.brand = this.brand.value;
    this.article.color = this.color.value;
    this.article.size = this.size.value;
    this.article.comments = this.comments.value;
    this.article.available = this.available.value;
    this.article.price = Number(this.price.value);
    this.article.quantity = Number(this.quantity.value);
    this.article.imageBase64 = this.base64Data;

    this.articleService.createArticle(this.article)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Artículo creado.', 'success');
          this.clearData();
        } else {
          this.alert('Atención', 'Artículo no creado.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Ocurrio un error al crear artículo.', 'error');
        }
      );
  }

  private validateData() {
    if (this.type.value === null || this.type.value === '') {
      this.openSnackBar('Debes indicar el tipo.', 'OK');
      return false;
    }
    if (this.reference.value === null || this.reference.value === '') {
      this.openSnackBar('Debes indicar la referencia.', 'OK');
      return false;
    }
    if (this.brand.value === null || this.brand.value === '') {
      this.openSnackBar('Debes indicar la marca.', 'OK');
      return false;
    }
    if (this.color.value === null || this.color.value === '') {
      this.openSnackBar('Debes indicar el color.', 'OK');
      return false;
    }
    if (this.size.value === null || this.size.value === '') {
      this.openSnackBar('Debes indicar el tamaño.', 'OK');
      return false;
    }
    if (this.comments.value === null || this.comments.value === '') {
      this.openSnackBar('Debes indicar el comentario.', 'OK');
      return false;
    }
    if (this.price.value === null || this.price.value === '') {
      this.openSnackBar('Debes indicar el precio.', 'OK');
      return false;
    }
    console.log(this.base64Data);
    if (this.base64Data === null || this.base64Data === '') {
      this.openSnackBar('Debes indicar la imagen del articulo.', 'OK');
      return false;
    }
    return true;
  }
  

  private numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
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

