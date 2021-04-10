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
    debugger;
    this.form.controls.reference.setValue(data.reference);
    this.form.controls.type.setValue(data.type);
    this.form.controls.comments.setValue(data.comments);
    this.form.controls.quantity.setValue(data.quantity);
    this.form.controls.color.setValue(data.color);
    this.form.controls.size.setValue(data.size);
    this.form.controls.price.setValue(data.price);
  }

  getData(idArticle: string): any {
    this.articleService.loadArticle(idArticle)
      .subscribe((response: any) => {
        this.setData(response.msg.entityData);
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
      price: new FormControl(0)
    });
  }

}
