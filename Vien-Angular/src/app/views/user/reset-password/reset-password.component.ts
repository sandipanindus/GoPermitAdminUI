import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('resetForm') resetForm: NgForm;
  emailModel = '';
  passwordModel = '';

  buttonDisabled = false;
  buttonState = '';

  constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }

  ConfirmPasswordMet() {
    var re = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}');
    if (this.resetForm.value.newPassword != this.resetForm.value.confirmPassword) {
      this.alert("Password and ConfirmPassword must match");
      return false;
    }
    else if (!re.test(this.resetForm.value.newPassword)) {
      this.alert('Password must have 1 Special Charecter,1 Small,1 Capital,1 Numaric,Password must be min 8 Charecters');
      // element.style.display = 'none';
      return false;
    }
    else if (this.resetForm.value.newPassword.length < 8) {
      this.alert('Password must be min 8 Charecters');
      //element.style.display = 'none';
      return false;
    }
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
    var re = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}');
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    if (this.resetForm.value.newPassword != this.resetForm.value.confirmPassword) {
      this.alert("Password and ConfirmPassword must match");
      // this.notifications.alert('Alert', "Password and ConfirmPassword must match", NotificationType.Alert, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
      element.style.display = 'none';
      return false;
    }
    else if (!re.test(this.resetForm.value.newPassword)) {
      this.alert('Password must have 1 Special Charecter,1 Small,1 Capital,1 Numaric,Password must be min 8 Charecters');
      element.style.display = 'none';
      return false;
    }
    else if (this.resetForm.value.newPassword.length < 8) {
      this.alert('Password must be min 8 Charecters');
      element.style.display = 'none';
      return false;
    }
    if (!this.resetForm.valid || this.buttonDisabled) {
      element.style.display = 'none';
      return false;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    var code = localStorage.getItem("EmailCode");
    this.authService.ResetPassword(code, this.resetForm.value.newPassword).subscribe((data: any) => {
      var result = JSON.parse(data);
      if (result.status == "200") {
        element.style.display = 'none';
        this.buttonDisabled = false;
        this.buttonState = '';
        this.router.navigateByUrl('user/thankyou?status=reset');


      }
      else {
        element.style.display = 'none';
        this.alert(result.message);
        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        this.buttonDisabled = false;
        this.buttonState = '';
      }


    }, (error) => {
      element.style.display = 'none';
      this.buttonDisabled = false;
      this.buttonState = '';
      this.errormsg(error.message);
      // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
    });
  }
}
