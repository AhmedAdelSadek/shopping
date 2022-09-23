import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppTopBarComponent } from './AppTopBar/AppTopBar.component';
import { AngularMaterialModule } from 'src/material.module';
import { PrimengModule } from 'src/primeng.module';

@NgModule({
  declarations: [HeaderComponent, SidebarComponent, FooterComponent, AppTopBarComponent],
  imports: [
    AngularMaterialModule,
    FlexLayoutModule,
    PrimengModule,
    CommonModule,
    RouterModule
  ],
  exports: [HeaderComponent, SidebarComponent, FooterComponent, AppTopBarComponent]
})
export class SiteFrameworkModule { }
