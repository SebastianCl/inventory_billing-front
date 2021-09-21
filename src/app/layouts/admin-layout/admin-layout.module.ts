import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReserveComponent } from '../../reserve/reserve.component';
import { InvoiceComponent } from '../../invoice/invoice.component';
import { InvoiceTypeComponent } from '../../invoice-type/invoice-type.component'

import { ProfilesComponent } from '../../profiles/profiles.component';
import { CustomerProfileComponent } from '../../customer-profile/customer-profile.component';
import { ListCustomerComponent } from '../../list-customer/list-customer.component';
import { EmployeeProfileComponent } from '../../employee-profile/employee-profile.component';
import { ListEmployeeComponent } from '../../list-employee/list-employee.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListUserComponent } from '../../list-user/list-user.component';
import { ListsComponent } from '../../lists/lists.component';
import { ArticleProfileComponent } from '../../article-profile/article-profile.component';
import { ListArticleComponent } from '../../list-article/list-article.component';
import { ListReserveComponent } from '../../list-reserve/list-reserve.component';

import { DetailsCustomerComponent } from '../../details-customer/details-customer.component';
import { DetailsEmployeeComponent } from '../../details-employee/details-employee.component';
import { DetailsUserComponent } from '../../details-user/details-user.component';
import { DetailsArticleComponent } from '../../details-article/details-article.component';
import { DetailsReserveComponent } from '../../details-reserve/details-reserve.component';
import { EditReserveComponent } from '../../edit-reserve/edit-reserve.component';
import { EditArticleComponent } from '../../edit-article/edit-article.component'
// Primeng
import { TableModule } from 'primeng/table';

// Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { CdkTableModule } from '@angular/cdk/table';



import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatCardModule
} from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import { ListInvoiceComponent } from 'app/list-invoice/list-invoice.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TableModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    CdkTableModule
  ],
  declarations: [
    DashboardComponent,
    ReserveComponent,
    InvoiceComponent,
    InvoiceTypeComponent,
    ProfilesComponent,
    CustomerProfileComponent,
    EmployeeProfileComponent,
    UserProfileComponent,
    ListUserComponent,
    ListsComponent,
    ListCustomerComponent,
    DetailsCustomerComponent,
    ListEmployeeComponent,
    DetailsEmployeeComponent,
    DetailsUserComponent,
    ArticleProfileComponent,
    ListArticleComponent,
    ListReserveComponent,
    DetailsArticleComponent,
    DetailsReserveComponent,
    ListInvoiceComponent,
    EditReserveComponent,
    EditArticleComponent
  ]
})

export class AdminLayoutModule { }
