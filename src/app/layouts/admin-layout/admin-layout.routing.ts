import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { QuoteComponent } from '../../quote/quote.component';
import { ProfilesComponent } from '../../profiles/profiles.component';
import { CustomerProfileComponent } from '../../customer-profile/customer-profile.component';
import { ListCustomerComponent } from '../../list-customer/list-customer.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListUserComponent } from '../../list-user/list-user.component';
import { ItemProfileComponent } from '../../item-profile/item-profile.component';
import { ListItemComponent } from '../../list-item/list-item.component';

import { ListsComponent } from '../../lists/lists.component';
import { ListQuoteComponent } from '../../list-quote/list-quote.component';
import { ListCustomerOrderComponent } from '../../list-customer-order/list-customer-order.component';

import { DetailsQuoteComponent } from '../../details-quote/details-quote.component';
import { DetailsCustomerOrderComponent } from '../../details-customerOrder/details-customerOrder.component';
import { DetailsCustomerComponent } from '../../details-customer/details-customer.component';
import { DetailsUserComponent } from '../../details-user/details-user.component';
import { DetailsItemComponent } from '../../details-item/details-item.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'quote', component: QuoteComponent },
    { path: 'profiles', component: ProfilesComponent },
    { path: 'add-customer', component: CustomerProfileComponent },
    { path: 'list-customer', component: ListCustomerComponent },
    { path: 'details-customer/:id', component: DetailsCustomerComponent },
    { path: 'add-user', component: UserProfileComponent },
    { path: 'list-user', component: ListUserComponent },
    { path: 'list-item', component: ListItemComponent },
    { path: 'details-user/:id', component: DetailsUserComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'list-quote', component: ListQuoteComponent },
    { path: 'add-item', component: ItemProfileComponent },
    { path: 'details-item/:id', component: DetailsItemComponent },

    { path: 'details-quote/:id', component: DetailsQuoteComponent },
    { path: 'list-customerOrder', component: ListCustomerOrderComponent },
    { path: 'details-customerOrder/:id', component: DetailsCustomerOrderComponent }
];
