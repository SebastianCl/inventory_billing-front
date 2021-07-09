import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Article } from '../models/article.model';
import { ArticleService } from '../service/article.service';


@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.css'],
  providers: [ArticleService]
})
export class ListArticleComponent implements OnInit {

  public listArticle: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public articleService: ArticleService) { }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data) {
    this.router.navigate(['/details-article', data.id]);
  }

  goToEdit(data) {
    this.router.navigate(['/edit-article', data.id]);
  }

  goToPage(url: string) {
    this.router.navigate([url]);
  }

  // Servicios
  getList(): any {
    this.articleService.loadArticles()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataArticle = {
              id: element.id,
              reference: element.reference,
              brand: element.brand
            }
            this.listArticle.push(dataArticle);
          });
        } else {
          this.alert('¡Aviso!', 'Sin registros.', 'warning');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeArticle('token');
            localStorage.removeArticle('article');
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

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

}
