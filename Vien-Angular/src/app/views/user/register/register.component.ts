import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @ViewChild('registerForm') registerForm: NgForm;
  buttonDisabled = false;
  buttonState = '';
  code: string;
  Id: number;
  sites: any = [];
  siteId:string;
  parkingbay:string;
  domainname: string;
  constructor(private spinner: NgxSpinnerService, private authService: AuthService, private notifications: NotificationsService, private router: Router) {


  }

  ngOnInit() {
    this.siteId="";
    this.parkingbay="0";
      this.spinner.show();
      this.GetSites();

    // this.authService.getdomain().subscribe((result: any) => {
    //   var data = JSON.stringify(result);
    //   var finalresult = JSON.parse(data);
    //   if (finalresult.status == "200") {
    //     this.domainname = finalresult.result.name;
    //   }
    //   this.spinner.hide();
    // });
  }
  GetSites() {
    this.authService.GetSites(1,0,1,0,0).subscribe((result: any) => {
      debugger;
    //  var data = JSON.stringify(result);
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        this.sites = finalresult.result;
      }
      this.spinner.hide();
    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  ConfirmPasswordMet() {
    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.notifications.alert('Alert', "Password and ConfirmPassword must match", NotificationType.Alert, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }

  onSubmit() {
    this.spinner.show();
    if (!this.registerForm.valid || this.buttonDisabled) {
      if (this.registerForm.value.firstName == null || this.registerForm.value.firstName == undefined || this.registerForm.value.firstName == "") {
        document.getElementById("txtfirstname").className = "form-control invalid-color";
      }
      if (this.registerForm.value.lastName == null || this.registerForm.value.lastName == undefined || this.registerForm.value.lastName == "") {
        document.getElementById("txtlastname").className = "form-control invalid-color";
      }
     
   
      if (this.registerForm.value.email == null || this.registerForm.value.email == undefined || this.registerForm.value.email == "") {
        document.getElementById("txtemail").className = "form-control invalid-color";
      }
      if (this.registerForm.value.contactNumber == null || this.registerForm.value.contactNumber == undefined || this.registerForm.value.contactNumber == "") {
        document.getElementById("txtcontactnumber").className = "form-control invalid-color";
      }
      if (this.registerForm.value.password == null || this.registerForm.value.password == undefined || this.registerForm.value.password == "") {
        document.getElementById("txtpassword").className = "form-control invalid-color";
      }
      
      this.spinner.hide();
      return;
    }
    
    

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
    this.code = emailcode.toString();
    var loginId = localStorage.getItem("LoginId");
    if (loginId == "null" || loginId == undefined || loginId == null) {
      this.Id = 0;
    }
    else {
      this.Id = parseInt(loginId);
    }
    debugger;
    var siteid=(document.getElementById("txtsite") as HTMLInputElement).value;
    var parkingbay=(document.getElementById("txtparkingbay") as HTMLInputElement).value;
    var data = {
      FirstName: this.registerForm.value.firstName,
      LastName: this.registerForm.value.lastName,
      SiteId: siteid,
      Address: this.registerForm.value.address,
      City: this.registerForm.value.city,
      State: this.registerForm.value.state,
      Zipcode: this.registerForm.value.zipcode,
      MobileNumber:this.registerForm.value.mobilenumber,
      Email:this.registerForm.value.email,
      ParkingBay:parkingbay,
      Password:this.registerForm.value.password,
      EmailCode: this.code,
      ParentId: this.Id
    }
    this.authService.SaveUser(data).subscribe((result: any) => {

      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        this.spinner.hide();
        this.buttonDisabled = false;
        this.buttonState = '';
        this.router.navigateByUrl('user/thankyou?status=register');




      }
      else {
        this.spinner.hide();
        this.notifications.alert('Alert', finalresult.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        this.buttonDisabled = false;
        this.buttonState = '';
      }
    }, (error) => {
      this.spinner.hide();
      this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      this.buttonDisabled = false;
      this.buttonState = '';
    });
  }
}
