import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReserveComponent } from '../../reserve/reserve.component';
import { ProfilesComponent } from '../../profiles/profiles.component';
import { EmployeeProfileComponent } from '../../employee-profile/employee-profile.component';
import { CustomerProfileComponent } from '../../customer-profile/customer-profile.component';
import { ListCustomerComponent } from '../../list-customer/list-customer.component';
import { ListEmployeeComponent } from '../../list-employee/list-employee.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListUserComponent } from '../../list-user/list-user.component';
import { ArticleProfileComponent } from '../../article-profile/article-profile.component';
import { ListArticleComponent } from '../../list-article/list-article.component';
import { ListReserveComponent } from '../../list-reserve/list-reserve.component';

import { ListsComponent } from '../../lists/lists.component';

import { DetailsCustomerComponent } from '../../details-customer/details-customer.component';
import { DetailsEmployeeComponent } from '../../details-employee/details-employee.component';
import { DetailsUserComponent } from '../../details-user/details-user.component';
import { DetailsArticleComponent } from '../../details-article/details-article.component';
import { DetailsReserveComponent } from '../../details-reserve/details-reserve.component';
import { EditReserveComponent } from '../../edit-reserve/edit-reserve.component';
import { EditArticleComponent } from '../../edit-article/edit-article.component'

import { InvoiceComponent } from '../../invoice/invoice.component';
import { InvoiceTypeComponent } from '../../invoice-type/invoice-type.component'
import { ListInvoiceComponent } from 'app/list-invoice/list-invoice.component';
import { ViewInvoiceComponent } from '../../view-invoice/view-invoice.component'

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'reserve', component: ReserveComponent },
    { path: 'profiles', component: ProfilesComponent },
    { path: 'add-customer', component: CustomerProfileComponent },
    { path: 'list-customer', component: ListCustomerComponent },
    { path: 'details-customer/:id', component: DetailsCustomerComponent },
    { path: 'add-employee', component: EmployeeProfileComponent },
    { path: 'list-employee', component: ListEmployeeComponent },
    { path: 'details-employee/:id', component: DetailsEmployeeComponent },
    { path: 'add-user', component: UserProfileComponent },
    { path: 'list-user', component: ListUserComponent },
    { path: 'list-article', component: ListArticleComponent },
    { path: 'details-user/:id', component: DetailsUserComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'add-article', component: ArticleProfileComponent },
    { path: 'details-article/:id', component: DetailsArticleComponent },
    { path: 'list-reserve', component: ListReserveComponent },
    { path: 'details-reserve/:id', component: DetailsReserveComponent },
    { path: 'invoice/:id', component: InvoiceComponent },
    { path: 'list-invoice', component: ListInvoiceComponent },
    { path: 'edit-reserve/:id', component: EditReserveComponent },
    { path: 'edit-article/:id', component: EditArticleComponent },
    { path: 'invoice-type/:id', component: InvoiceTypeComponent },
    { path: 'view-invoice/:id', component: ViewInvoiceComponent },
];
