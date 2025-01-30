import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
    selector: 'app-edit-user-modal',
    templateUrl: './edit-user-modal.component.html',
    styles: []
})
export class EditUserModalComponent implements OnInit {
    countries:any=[];
    roles:any=[];
    UserId: number;
    modalRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right'
    };
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

    show(id) {
        this.UserId = id;
        this.authService.GetUsersById(this.UserId).subscribe((result: any) => {
            debugger;
           // var data = JSON.stringify(result);
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.firstname = finalresult.result.firstName;
                this.lastname = finalresult.result.lastName;
                this.email=finalresult.result.email;
                this.contactnumber=finalresult.result.contactNumber;
                this.address1=finalresult.result.address1;
                this.address2=finalresult.result.address2;
                this.state=finalresult.result.state;
                this.city=finalresult.result.city;
                this.countryId=finalresult.result.countryId;
                this.zipcode=finalresult.result.zipcode;
                this.roleId=finalresult.result.roleId;
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
        this.modalRef = this.modalService.show(this.template, this.config);
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
    UpdateUser() {
        debugger;
        this.usersubmitted = true;
        if (this.userForm.invalid) {
            return;
        }
        var data = {
            Id:this.UserId,
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
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }
        this.authService.UpdateUser(data).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success',"User updated successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false, clickToClose: true });
                setTimeout(() => {
                    this.modalRef.hide();
                }, 2000);
                setTimeout(() => {
                    window.location.reload();
                 }, 1000);
              
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
               
            }
        }, (error) => {
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }
}
