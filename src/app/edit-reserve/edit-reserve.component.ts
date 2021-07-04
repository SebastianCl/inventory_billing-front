import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ReserveService } from '../service/reserve.service';
import { ArticleService } from '../service/article.service';
import { EditReserve } from '../models/reserve.model';

@Component({
  selector: 'app-edit-reserve',
  templateUrl: './edit-reserve.component.html',
  styleUrls: ['./edit-reserve.component.css'],
  providers: [ReserveService, ArticleService]
})
export class EditReserveComponent implements OnInit {

  edit_reserve: EditReserve;
  public form: FormGroup;
  public listArticles: FormGroup;
  public listGarment: any[];
  public dsbSave: boolean;
  public subtotal: FormControl;
  public totalDiscount: FormControl;
  public totalReserve: FormControl; 
  public endDate: FormControl; 
  public startDate: FormControl;
  public idReserve: String;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public reserveService: ReserveService,
    private articleService: ArticleService,
    public fb: FormBuilder
  ) {
    this.createForm();
    this.listArticles = this.fb.group({ rows: this.fb.array([]) });
    this.listGarment = [];
    this.subtotal = new FormControl();
    this.totalDiscount = new FormControl();
    this.totalReserve = new FormControl();
    this.endDate = new FormControl();
    this.startDate = new FormControl();
    this.getListGarments();
  }

  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  getData(idReserve: string): any {
    this.reserveService.loadReserve(idReserve)
      .subscribe((response: any) => {
        this.setData(response.msg, idReserve);
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
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      );
  }

  setData(data, idReserve) {
    console.info(data);
    this.form.controls.reserveNumber.setValue(data.reserveNumber);
    this.form.controls.invoiceNumber.setValue(data.invoiceNumber);
    this.form.controls.customerName.setValue(data.customerName);
    this.form.controls.employeName.setValue(data.employeeName);
    this.form.controls.reserveDay.setValue(this.convertDates(data.reserveDay));
    this.startDate.setValue(data.reserveDay);
    this.endDate.setValue(data.endDate);
    this.idReserve = idReserve.toString();
    this.form.controls.description.setValue(data.description);

    let array_articles = data.articles;

    for ( let indx in array_articles ) {

      let element = array_articles[indx];

      const control = this.listArticles.get('rows') as FormArray;
      control.push(this.fb.group({
        discount: element.discount,
        garmentReference: element.reference,
        price: element.price,
        quantity: 1,
        total: 0
      }));

    }

    let isActive = data.active ? 'ACTIVA' : 'CERRADA';
    this.form.controls.isActive.setValue(isActive);
    this.calculateTotals();
  }

  addArticle() {

    const control = this.listArticles.get('rows') as FormArray;
    control.push(this.fb.group({
      discount: 0,
      garmentReference: '',
      price: 0,
      quantity: 1,
      total: 0
    }));

  }

  removeArticle(index: number) {
    const control = this.listArticles.get('rows') as FormArray;
    control.removeAt(index);
    this.calculateTotals();
  }
  
  public createForm() {

    this.form = new FormGroup({
      reserveNumber: new FormControl(''),
      reserveDay: new FormControl(''),
      invoiceNumber: new FormControl(''),
      customerName: new FormControl(''),
      employeName: new FormControl(''),
      description: new FormControl(''),
      isActive: new FormControl('')
    });
  }

  back() {
    this.router.navigate(['/list-reserve']);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getListGarments(): any {
    this.articleService.loadArticles()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.reference.localeCompare(b.reference)).forEach(element => {
            this.listGarment.push(element);
          });
        } else {
          this.listGarment = [];
        }
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
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      )
  }

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  setGarmentPrice(garment, index) {
    var dataArticle = this.listGarment.filter((e) => e.reference === garment.value);
    ((this.listArticles.get('rows') as FormArray).at(index) as FormGroup).get('price').setValue(dataArticle[0].price);
    this.calculateTotals();
  }

  editReserve() {

    // Validar todos los datos basicos
    if (!this.validateForm()) {
      // this.changeShow();
      return;
    }

    // Validar todos los datos de productos
    if (!this.validateRows()) {
      // this.changeShow();
      return;
    }

    const control = this.listArticles.get('rows') as FormArray;
    const rows = control.value;
    let articleList = [];

    for (let indx in rows) {

      const element = rows[indx];
      articleList.push({ ref: element.garmentReference, price: element.price, discount: element.discount });

    }
    
    this.edit_reserve = new EditReserve();
    this.edit_reserve.id = this.idReserve;
    this.edit_reserve.endDate = this.convertDates(this.endDate.value);
    this.edit_reserve.description = this.form.controls.description.toString();
    this.edit_reserve.articles = articleList;

  }

  private validateForm() {
    if (this.endDate.value === null || this.endDate.value === '') {
      this.openSnackBar('Debe seleccionar una fecha final para la reserva', 'OK');
      return false;
    }
    return true;
  }

  private validateRows() {

    // Validar campos de artículos
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;
    let validRowsIndex: Number;
    let sw = false;

    for (let indx in rowsArticles){

      const element = rowsArticles[indx];

      if (element.garmentReference === '' || element.discount > 100 || element.price < 0 || element.quantity < 0) {
        validRowsIndex = Number(indx) + 1;
        sw = false;
        break;
      } else {
        sw = true;
      }

    }

    if (!sw) {
      this.openSnackBarLarge(`En las filas # ` + validRowsIndex.toString() + ` debe verificarse que todos los campos de producto esten diligenciados.`, 'OK');
      return false;
    }

    return true;
  }

  dateLessThan(event) {
    const now = new Date(event);
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();

    if (dd != '0' && mm != '0' && yyyy > 2000) {
      if (new Date(this.startDate.value) >= new Date(this.endDate.value)) {
        this.openSnackBar('La fecha final de reserva debe ser mayor a la fecha inicial de reserva', 'OK');
        this.endDate.reset();
      }
    }
  }

   // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private openSnackBarLarge(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 6000, panelClass: ['mycsssnackbartest'] });
  }

  convertDates(value) {
    const now = new Date(value);
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  calculateTotals() {

    // Validar campos de artículos
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;

    // Variables para calcular resumen del detalle
    let valSubTotal = 0;
    let valDescuento = 0;

    for (let index = 0; index < rowsArticles.length; index++) {

      const element = rowsArticles[index];
      let valCantidad = element.quantity;
      let valUnitario = element.price;
      let valNeto = (valCantidad * valUnitario);
      let pDescuento = element.discount;

      valSubTotal = valSubTotal + valNeto;
      valDescuento = valDescuento + (valNeto * (pDescuento / 100));
    }

    let valTotal = (valSubTotal - valDescuento);

    this.subtotal.setValue(valSubTotal); // SUBTOTAL
    this.totalDiscount.setValue(valDescuento); // TOTAL DE DESCUENTOS
    this.totalReserve.setValue(valTotal); // TOTAL DE RESERVA

  }

}
