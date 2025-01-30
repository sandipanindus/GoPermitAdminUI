import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ApprovalemailComponent } from './approvalemail.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from 'src/app/shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';

@NgModule({
  declarations: [LoginComponent,WelcomeComponent,ThankyouComponent, RegisterComponent, ForgotPasswordComponent, UserComponent, ResetPasswordComponent,ApprovalemailComponent,SetPasswordComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    UserRoutingModule,
    FormsModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class UserModule { }
