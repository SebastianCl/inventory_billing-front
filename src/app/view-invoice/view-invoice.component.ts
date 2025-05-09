import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

//Services
import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css'],
  providers: [InvoiceService]
})
export class ViewInvoiceComponent implements OnInit {

  //Response service invoice
  public typeInvoice: string;
  public stringInvoice: string;
  public numberInvoice: string;
  public dateInvoice: string;
  public employeeName: string;
  public customName: string;
  public customDocument: string;
  public customAddress: string;
  public customEmail: string;
  public description: string;
  public typeDeposito: string;
  public boolDeposito: boolean;
  public anyArticles: any;
  public subTotal: number;
  public payment: number;
  public total: number;
  public deposit: number;
  public startDate: string;
  public typePay: string;
  constructor(
    //Services
    public invoiceService: InvoiceService,
    public route: ActivatedRoute,
  ) {
    //Response service invoice
    this.typeInvoice = '';
    this.stringInvoice = '';
    this.numberInvoice = '';
    this.dateInvoice = '';
    this.employeeName = '';
    this.customName = '';
    this.customDocument = '';
    this.customAddress = '';
    this.customEmail = '';
    this.description = '';
    this.typeDeposito = '';
    this.boolDeposito = false;
    this.anyArticles = [];
    this.subTotal = 0;
    this.payment = 0;
    this.total = 0;
    this.deposit = 0;
    this.startDate = '';
    this.typePay = '';
  }

  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  private getData(idInvoice: string): any {
    this.invoiceService.loadInvoice(idInvoice).subscribe((response: any) => {
      if (response.resp) {
        this.typeInvoice = response.msg.type;
        switch (this.typeInvoice) {
          case '1':
            this.stringInvoice = 'Factura de reserva';
            break;
          case '2':
            this.stringInvoice = 'Factura de venta';
            break;
          default:
            this.stringInvoice = 'Factura otros servicios';
            break;
        }
        this.numberInvoice = response.msg.invoiceNumber;
        this.dateInvoice = this.convertDates(response.msg.date);
        this.employeeName = response.msg.employeeName;
        this.customName = response.msg.customerName;
        this.customDocument = response.msg.customerIdentification;
        this.customAddress = response.msg.customerDirection;
        this.customEmail = response.msg.customerEmail;
        this.description = response.msg.description;
        this.typeDeposito = (response.msg.depositState === false) ? 'NO' : 'SI';
        this.boolDeposito = response.msg.depositState;
        this.anyArticles = response.msg.articles;
        this.subTotal = Number(response.msg.cost);
        this.payment = Number(response.msg.payment);
        this.deposit = Number(response.msg.deposit);
        this.total = this.subTotal - this.payment;

        let startDate = new Date(response.msg.reserve.startDate);
        this.startDate = startDate.toLocaleDateString();

        let transfer = response.msg.transfer ? 'Transferencia' : '';
        let cash = response.msg.cash ? 'Efectivo' : '';
        this.typePay = `${transfer} ${cash}`;
      }
      else {
        this.alert('Atención', 'No se encontro ninguna factura por este id.', 'warning');
      }
    }, (err) => {
      console.info(err);
    });
  }

  private convertDates(value) {
    const now = new Date(value);
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  private addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  public printPage() {
    const printContents = document.getElementById('row-invoice-print').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }

}
