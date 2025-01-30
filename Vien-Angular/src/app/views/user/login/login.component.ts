import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsComponent } from '../../app/dashboards/analytics/analytics.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = '';
  passwordModel = '';

  buttonDisabled = false;
  buttonState = '';

  constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
    this.onLogin();
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
  onLogin() {
    var data = {
      UserName: 'admin',
      Password: 'labelpad'
    }
    this.authService.Gettoken(data).subscribe((result: any) => {
      debugger;
      var finalresult = JSON.stringify(result);

    })
  }
  onSubmit() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    if (!this.loginForm.valid || this.buttonDisabled) {
      if (this.loginForm.value.email == null || this.loginForm.value.email == undefined || this.loginForm.value.email == "") {
        document.getElementById("txtemail").className = "form-control invalid-color";
      }
      if (this.loginForm.value.password == null || this.loginForm.value.password == undefined || this.loginForm.value.password == "") {
        document.getElementById("txtpassword").className = "form-control invalid-color";
      }
      element.style.display = 'none';
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    debugger;
    this.authService.UserLogin(this.loginForm.value.name, this.loginForm.value.password).subscribe((data: any) => {
      debugger;
      var result = JSON.stringify(data);
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        element.style.display = 'none';
        localStorage.setItem("firstname", finalresult.result.firstName);
        localStorage.setItem("lastname", finalresult.result.lastName);
        localStorage.setItem("organisationname", finalresult.result.organisationName);
        localStorage.setItem("email", finalresult.result.workEmail);
        localStorage.setItem("LoginId", finalresult.result.id);
        localStorage.setItem("ClientId", finalresult.result.clientId);
        localStorage.setItem("RoleId", finalresult.result.roleId);
        localStorage.setItem("SiteId", finalresult.result.siteId);
        localStorage.setItem("subdomain", finalresult.result.subdomain);
        localStorage.setItem("ProfilePath", finalresult.result.profilePath);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.router.navigate(['/app/dashboards/default']);
        //  const toast= this.notifications.success('Success', finalresult.message, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false, clickToClose: true  });

        //   toast.click.subscribe((event) => {
        //     debugger;

        // }); 
      }
      else {
        element.style.display = 'none';
        this.buttonDisabled = false;
        this.buttonState = '';
        this.alert(finalresult.message);
        // this.notifications.alert('Alert', finalresult.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      element.style.display = 'none';
      this.buttonDisabled = false;
      this.buttonState = '';
      this.errormsg(error.message)
      // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
    });
  }
}
