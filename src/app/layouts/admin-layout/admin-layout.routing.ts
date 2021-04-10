import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReserveComponent } from '../../reserve/reserve.component';
import { ProfilesComponent } from '../../profiles/profiles.component';
import { CustomerProfileComponent } from '../../customer-profile/customer-profile.component';
import { ListCustomerComponent } from '../../list-customer/list-customer.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListUserComponent } from '../../list-user/list-user.component';
import { ArticleProfileComponent } from '../../article-profile/article-profile.component';
import { ListArticleComponent } from '../../list-article/list-article.component';
import { ListReserveComponent } from '../../list-reserve/list-reserve.component';

import { ListsComponent } from '../../lists/lists.component';

import { DetailsCustomerComponent } from '../../details-customer/details-customer.component';
import { DetailsUserComponent } from '../../details-user/details-user.component';
import { DetailsArticleComponent } from '../../details-article/details-article.component';
import { DetailsReserveComponent } from '../../details-reserve/details-reserve.component';

import { InvoiceComponent } from '../../invoice/invoice.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'reserve', component: ReserveComponent },
    { path: 'profiles', component: ProfilesComponent },
    { path: 'add-customer', component: CustomerProfileComponent },
    { path: 'list-customer', component: ListCustomerComponent },
    { path: 'details-customer/:id', component: DetailsCustomerComponent },
    { path: 'add-user', component: UserProfileComponent },
    { path: 'list-user', component: ListUserComponent },
    { path: 'list-article', component: ListArticleComponent },
    { path: 'details-user/:id', component: DetailsUserComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'add-article', component: ArticleProfileComponent },
    { path: 'details-article/:id', component: DetailsArticleComponent },
    { path: 'list-reserve', component: ListReserveComponent },
    { path: 'details-reserve/:id', component: DetailsReserveComponent },
    { path: 'invoice', component: InvoiceComponent }
];
