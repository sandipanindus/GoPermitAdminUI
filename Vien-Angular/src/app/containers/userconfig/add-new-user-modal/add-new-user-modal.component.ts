import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
    selector: 'app-add-new-user-modal',
    templateUrl: './add-new-user-modal.component.html',
    styles: []
})
export class AddNewUserModalComponent implements OnInit {
    countries:any=[];
    roles:any=[];
    modalRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right'
    };
    code:string;
    usersubmitted = false;
    userForm: FormGroup;
    firstname: string;
    lastname: string;
    email:string;
    contactnumber:string;
    address1:string;
    address2:string;
    city:string;
    state:string;
    countryId:number;
    zipcode:string;
    roleId:number;
    @ViewChild('template', { static: true }) template: TemplateRef<any>;

    constructor(private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.userForm = this.formBuilder.group({
            rfirstname: ['', Validators.required],
            rlastname: ['', Validators.required],
            remail: ['', Validators.required]
        });

    }
    get r() { return this.userForm.controls; }
    ngOnInit() {
        var loginId=localStorage.getItem("LoginId");
        this.authService.GetRoles(1,0,loginId,1).subscribe((result:any)=>{
          debugger;
         // var data=JSON.stringify(result);
          var finalresult=JSON.parse(result);
          if(finalresult.status=="200"){
            this.roles=finalresult.result;         
          }
          else{           
              this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });           
          }
        });
        this.authService.GetCountries().subscribe((result:any)=>{
            debugger;
           // var data=JSON.stringify(result);
            var finalresult=JSON.parse(result);
            if(finalresult.status=="200"){
              this.countries=finalresult.result;         
            }
            else{          
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });           
            }
          });
    }

    show() {
        this.modalRef = this.modalService.show(this.template, this.config);
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
    SaveUser() {
        debugger;
        this.usersubmitted = true;
        if (this.userForm.invalid) {
            return;
        }
        var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
        this.code = emailcode.toString();
        var data = {
            FirstName: this.firstname,
            LastName: this.lastname,
            Email:this.email,
            ContactNumber:this.contactnumber,
            Address1:this.address1,
            Address2:this.address2,
            City:this.city,
            State:this.state,
            CountryId:this.countryId,
            ZipCode:this.zipcode,
            RoleId:this.roleId,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            EmailCode:this.code
        }
        this.authService.AddUser(data).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success',"User added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false, clickToClose: true });
                setTimeout(() => {
                    this.modalRef.hide();
                }, 2000);
                setTimeout(() => {
                   window.location.reload();
                }, 1000);
                this.firstname='';
                this.lastname='';
                this.email='';
                this.address1='';
                this.address2='';
                this.contactnumber='';
                this.city='';
                this.state='';
                this.countryId=0;
                this.zipcode='';
                this.roleId=0;

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
               
            }
        }, (error) => {
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }
}
