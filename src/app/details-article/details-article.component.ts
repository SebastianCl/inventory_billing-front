import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { ArticleService } from '../service/article.service';

@Component({
  selector: 'app-details-article',
  templateUrl: './details-article.component.html',
  styleUrls: ['./details-article.component.css'],
  providers: [ArticleService]
})
export class DetailsArticleComponent implements OnInit {

  public form: FormGroup;
  public cols: any;
  public imagePreview: string;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public articleService: ArticleService) {
    this.createForm();
  }

  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-article']);
  }

  setData(data) {
    this.form.controls.type.setValue(data.type);
    this.form.controls.color.setValue(data.color);
    this.form.controls.brand.setValue(data.brand);
    this.form.controls.comments.setValue(data.comments);
    this.form.controls.code.setValue(data.code);
    this.form.controls.price.setValue(data.price);
    this.form.controls.size.setValue(data.size);
    this.form.controls.quantity.setValue(data.quantity);
    this.imagePreview = 'https://storage.googleapis.com/bellarose-qa.appspot.com/' + data.imageURL;
    let available = data.available ? 'DISPONIBLE' : 'NO DISPONIBLE';
    this.form.controls.available.setValue(available);
  }

  getData(idArticle: string): any {
    this.articleService.loadArticle(idArticle)
      .subscribe((response: any) => {
        this.setData(response.msg);
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
      type: new FormControl(''),
      color: new FormControl(''),
      brand: new FormControl(''),
      comments: new FormControl(''),
      code: new FormControl(''),
      price: new FormControl(0),
      size: new FormControl(''),
      quantity: new FormControl(''),
      available: new FormControl('')
    });
  }

}
