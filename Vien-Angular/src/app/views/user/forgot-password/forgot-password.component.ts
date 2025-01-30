import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [
    `
    .card_cls {
      margin: auto;
      width: 60%;
      background: rgb(245 242 242 / 60%);
      color: #333 !important;
      box-shadow: 0 0px 56px rgba(0, 0, 0, 0.3);
    }
    @media screen and (max-width: 425px) {
      .card_cls {
        margin: auto;
        width:100%;
        background: rgb(245 242 242 / 60%);
        color: #333 !important;
        box-shadow: 0 0px 56px rgba(0, 0, 0, 0.3);
      }
      .email_cls {
        margin-left: 12px;
      }
      .logo-single {
        width: 280px;
        height: 75px;
        background: url(Logo.png) no-repeat;
        background-position: center center;
        display: inline-block;
        margin-bottom: 30px;
        background-size: contain;
      }
     }
     @media screen and (max-width: 768px) {
      .logo-single {
        width: 245px;
        height: 75px;
        background: url(Logo.png) no-repeat;
        background-position: center center;
        display: inline-block;
        margin-bottom: 30px;
        background-size: contain;
      }
     }
    `
  ]
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('passwordForm') passwordForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(private translate:TranslateService,private spinner:NgxSpinnerService,private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }
  onSuccess(msg) {
    this.notifications.create(this.translate.instant('Success'),
      this.translate.instant(msg), NotificationType.Success,
      { timeOut: 3000, showProgressBar: true });
  }
  errormsg(msg) {
    this.notifications.create(this.translate.instant('Error'),
      this.translate.instant(msg), NotificationType.Error, {
      timeOut: 3000,
      showProgressBar: true
    });
  }
  alert(msg) {
    this.notifications.create(this.translate.instant('Alert'),
      this.translate.instant(msg), NotificationType.Alert, {
      timeOut: 3000,
      showProgressBar: true
    });
  }
  onSubmit() {
    var element=document.getElementById("loading") as HTMLDivElement;
    element.style.display='block';
    if (!this.passwordForm.valid || this.buttonDisabled) {
      if (this.passwordForm.value.email == null || this.passwordForm.value.email == undefined || this.passwordForm.value.email == "") {
        document.getElementById("txtemail").className = "form-control invalid-color";
      }
      element.style.display='none';
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.authService.ForgetPassword(this.passwordForm.value.email).subscribe((data:any) => {

      var result=JSON.parse(data);
      if(result.status=="200"){
        element.style.display='none';
        this.buttonDisabled = false;
        this.buttonState = '';

      this.router.navigateByUrl('user/thankyou?status=forget');


      }
      else{
        element.style.display='none';
        this.alert(result.message);
       // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      element.style.display='none';
      this.errormsg(error.message);
      //this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      this.buttonDisabled = false;
      this.buttonState = '';
    });

  }

}
