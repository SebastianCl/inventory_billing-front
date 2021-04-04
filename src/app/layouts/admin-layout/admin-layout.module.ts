import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { QuoteComponent } from '../../quote/quote.component';

import { ProfilesComponent } from '../../profiles/profiles.component';
import { CustomerProfileComponent } from '../../customer-profile/customer-profile.component';
import { ListCustomerComponent } from '../../list-customer/list-customer.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListUserComponent } from '../../list-user/list-user.component';
import { ListsComponent } from '../../lists/lists.component';
import { ListQuoteComponent } from '../../list-quote/list-quote.component';
import { ListCustomerOrderComponent } from '../../list-customer-order/list-customer-order.component';
import { ItemProfileComponent } from '../../item-profile/item-profile.component';
import { ListItemComponent } from '../../list-item/list-item.component';

import { DetailsQuoteComponent } from '../../details-quote/details-quote.component';
import { DetailsCustomerOrderComponent } from '../../details-customerOrder/details-customerOrder.component';
import { DetailsCustomerComponent } from '../../details-customer/details-customer.component';
import { DetailsUserComponent } from '../../details-user/details-user.component';
import { DetailsItemComponent } from '../../details-item/details-item.component';
// Primeng
import { TableModule } from 'primeng/table';

// Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
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
  MatSelectModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
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

    CdkTableModule
  ],
  declarations: [
    DashboardComponent,
    QuoteComponent,
    ProfilesComponent,
    CustomerProfileComponent,
    ListCustomerOrderComponent,
    UserProfileComponent,
    ListUserComponent,
    ListsComponent,
    ListQuoteComponent,
    ListCustomerComponent,
    DetailsQuoteComponent,
    DetailsCustomerOrderComponent,
    DetailsCustomerComponent,
    DetailsUserComponent,
    ItemProfileComponent,
    ListItemComponent,
    DetailsItemComponent
  ]
})

export class AdminLayoutModule { }
