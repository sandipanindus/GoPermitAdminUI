import { Component, OnInit } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router'
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-approvalemail',
  templateUrl: './approvalemail.component.html',

})
export class ApprovalemailComponent implements OnInit {
  constructor(private spinner:NgxSpinnerService,private approute: ActivatedRoute, private route: Router, private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit(): void {   
    this.ValidateEmail();
    this.ValidatePassword();
    this.SetPassword();
  }
  spinnerload() {
    var element=document.getElementById("loading") as HTMLDivElement;
    element.style.display='block';
    setTimeout(() => {
      element.style.display='none';
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.spinnerload();
  }
  ValidatePassword() {
    var Id = this.approute.snapshot.queryParamMap.get('ForgetId')
    if (Id != null) {
      localStorage.setItem("EmailCode", Id);
      
      this.router.navigateByUrl('user/reset-password');
    }
  }
  SetPassword() {
    var Id = this.approute.snapshot.queryParamMap.get('SetPassword')
    if (Id != null) {
      localStorage.setItem("EmailCode", Id);
      this.router.navigateByUrl('user/set-password');
    }
  }
  ValidateEmail() {
    var Id = this.approute.snapshot.queryParamMap.get('VerifyId')
    if (Id != null) {
      this.authService.EmailVerification(Id).subscribe((data: any) => {
        var result = JSON.parse(data);

        if (result.status == '200') {
      
           
            this.router.navigateByUrl('user/welcome');
       
        }
        else {
          this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
        }
      })
    }
  }
}
