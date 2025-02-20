import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { PagePasswordComponent } from './page-password/page-password.component';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { SimpleNotificationsModule } from 'angular2-notifications'; // Import this



@NgModule({
  declarations: [BlankPageComponent, AppComponent, PagePasswordComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(), // Add this line

  ]
})
export class AppModule { }

