import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox/typings/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EditArticle } from '../models/article.model';
import { ArticleService } from '../service/article.service';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
  providers: [ArticleService]
})
export class EditArticleComponent implements OnInit {

  article: EditArticle;
  public form: FormGroup;
  public imagePreview: string;
  public base64Image: String;
  public editIdArticle: string;
  dsbSave: boolean;
  hiddenProgBar: boolean;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public articleService: ArticleService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder
  ) { 
    this.createForm();
  }

  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  getData(idArticle: string): any {
    this.articleService.loadArticle(idArticle)
      .subscribe((response: any) => {
        this.setData(response.msg, idArticle);
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeArticle('token');
            localStorage.removeArticle('user');
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

  setData(data, idArticle) {
    this.form.controls.type.setValue(data.type);
    this.form.controls.comments.setValue(data.comments);
    this.form.controls.size.setValue(data.size);
    this.form.controls.price.setValue(data.price);
    this.form.controls.quantity.setValue(data.quantity);
    this.form.controls.reference.setValue(data.reference);
    this.form.controls.brand.setValue(data.brand);
    this.form.controls.color.setValue(data.color);
    this.imagePreview = `${environment.urlImage}/${data.imageURL}` ;
    let isAvailable = data.available ? 'DISPONIBLE' : 'NO DISPONIBLE';
    this.form.controls.available.setValue(isAvailable);
    this.form.controls.checkAvailable.setValue(data.available);
    this.editIdArticle = idArticle;
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  public createForm() {
    this.form = new FormGroup({
      type: new FormControl(''),
      comments: new FormControl(''),
      size: new FormControl(''),
      price: new FormControl(''),
      quantity: new FormControl(''),
      reference: new FormControl(''),
      brand: new FormControl(''),
      color: new FormControl(''),
      available: new FormControl(''),
      checkAvailable: new FormControl('')
    });
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  back() {
    this.router.navigate(['/list-article']);
  }

  uploadFile(event) {

    const readers = new FileReader();
    const dataFile = event[0];

    readers.readAsDataURL(dataFile);
    readers.onload = () => {
      let resultBase64 = readers.result.toString();
      this.imagePreview = resultBase64;
      this.base64Image = resultBase64.split(',')[1];
    }
  }

  showOptions(event:MatCheckboxChange): void {
    let isAvailable = event.checked ? 'DISPONIBLE' : 'NO DISPONIBLE';
    this.form.controls.available.setValue(isAvailable);
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private validateData() {
    let form = this.form.controls;
    if (form.type.value === null || form.type.value === '') {
      this.openSnackBar('Debes indicar el tipo.', 'OK');
      return false;
    }
    if (form.reference.value === null || form.reference.value === '') {
      this.openSnackBar('Debes indicar la referencia.', 'OK');
      return false;
    }
    if (form.brand.value === null || form.brand.value === '') {
      this.openSnackBar('Debes indicar la marca.', 'OK');
      return false;
    }
    if (form.color.value === null || form.color.value === '') {
      this.openSnackBar('Debes indicar el color.', 'OK');
      return false;
    }
    if (form.size.value === null || form.size.value === '') {
      this.openSnackBar('Debes indicar la talla.', 'OK');
      return false;
    }
    if (form.comments.value === null || form.comments.value === '') {
      this.openSnackBar('Debes indicar la descripción.', 'OK');
      return false;
    }
    if (form.price.value === null || form.price.value === '') {
      this.openSnackBar('Debes indicar el precio.', 'OK');
      return false;
    }
    if (this.base64Image === null || this.base64Image === '') {
      this.openSnackBar('Debes indicar la imagen del articulo.', 'OK');
      return false;
    }
    return true;
  }

  editArticle() {
    this.changeShow();
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    this.edit();
  }

  private edit() {

    let form = this.form.controls;

    this.article = new EditArticle();
    this.article.type = form.type.value;
    this.article.reference = form.reference.value;
    this.article.brand = form.brand.value;
    this.article.color = form.color.value;
    this.article.size = form.size.value;
    this.article.comments = form.comments.value;
    this.article.price = form.price.value;
    this.article.quantity = form.quantity.value;
    this.article.available = form.checkAvailable.value;
    this.article.imageBase64 = (this.base64Image === undefined) ? String('') : String(this.base64Image) ;

    this.articleService.editArticle(this.article, this.editIdArticle)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Artículo editado.', 'success');
          this.back();
        } else {
          this.alert('Atención', 'Artículo no editado.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Ocurrio un error al editar artículo.', 'error');
        }
      );

  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }

}
