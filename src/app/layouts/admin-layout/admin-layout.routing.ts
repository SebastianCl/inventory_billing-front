import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReserveComponent } from '../../reserve/reserve.component';
import { ProfilesComponent } from '../../profiles/profiles.component';
import { CustomerProfileComponent } from '../../customer-profile/customer-profile.component';
import { ListCustomerComponent } from '../../list-customer/list-customer.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListUserComponent } from '../../list-user/list-user.component';
import { ItemProfileComponent } from '../../item-profile/item-profile.component';
import { ListItemComponent } from '../../list-item/list-item.component';

import { ListsComponent } from '../../lists/lists.component';

import { DetailsCustomerComponent } from '../../details-customer/details-customer.component';
import { DetailsUserComponent } from '../../details-user/details-user.component';
import { DetailsItemComponent } from '../../details-item/details-item.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'reserve', component: ReserveComponent },
    { path: 'profiles', component: ProfilesComponent },
    { path: 'add-customer', component: CustomerProfileComponent },
    { path: 'list-customer', component: ListCustomerComponent },
    { path: 'details-customer/:id', component: DetailsCustomerComponent },
    { path: 'add-user', component: UserProfileComponent },
    { path: 'list-user', component: ListUserComponent },
    { path: 'list-item', component: ListItemComponent },
    { path: 'details-user/:id', component: DetailsUserComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'add-item', component: ItemProfileComponent },
    { path: 'details-item/:id', component: DetailsItemComponent }
];
