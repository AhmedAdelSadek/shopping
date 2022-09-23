import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'orders', component: ListOrdersComponent }
];


@NgModule({
  declarations: [ListOrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ListOrdersComponent]
})
export class OrdersModule { }
