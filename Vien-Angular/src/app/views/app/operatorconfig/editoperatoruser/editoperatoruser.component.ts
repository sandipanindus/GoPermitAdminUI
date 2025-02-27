
  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
  import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
  import { AuthService } from 'src/app/shared/auth.service';
  import { NotificationsService, NotificationType } from 'angular2-notifications';
  import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
  import { Router, ActivatedRoute } from '@angular/router';

  
  @Component({
    selector: 'app-editoperatoruser',
    templateUrl: './editoperatoruser.component.html',
    styleUrls: ['./editoperatoruser.component.scss']
  })
  export class EditoperatoruserComponent implements OnInit {
    operatorUserForm!: FormGroup;
   // Replace with actual values
    constructor(private router: Router,private fb: FormBuilder, private approute: ActivatedRoute, private http: HttpClient,private notifications: NotificationsService, private authService: AuthService) {}
  Rolesdata:any[]=[];
  operatordata:any[] = [];
  selectedOperator: string;
  
   modalRef: BsModalRef;
   buttonDisabled = false;

  
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
  
  editid:any;
  
    ngOnInit() {
      this.operatorUserForm = this.fb.group({
        operators: [''],
        userName: ['', Validators.required],
        email: ['', Validators.required],
        mobileNumber: ['', Validators.required],
        role: ['', Validators.required],
        microsoftAccount: [false],
  
  
      });


      this.agent=this.getBrowserName();

      var id = this.approute.snapshot.params['id']
      var value = this.approute.snapshot.params['value']
      this.Edit(id, value);
      this.editid=id;
    
  
  this.Getroles()
      this.Getopertaors()
    }

   agent


  
   Edit(id: any, value: any) {
    if (value == "view") {

      this.buttonDisabled=true;
      Object.keys(this.operatorUserForm.controls).forEach(field => {
        this.operatorUserForm.controls[field].disable();
      });
    

    }
    else {

        this.buttonDisabled=false;
        Object.keys(this.operatorUserForm.controls).forEach(field => {
          this.operatorUserForm.controls[field].enable();
        });

    }
   
    this.authService.GetUsersById(id).subscribe((result: any) => {
        debugger;
        var finalresult = JSON.parse(result);
        finalresult=finalresult.result;
        console.log("editdata",result);
        if (finalresult) {
          this.operatorUserForm.patchValue({
            operators: finalresult.operatorId || '',
            userName: finalresult.firstName || '',
            email: finalresult.email || '',
            mobileNumber: finalresult.mobileNumber || '',
            role: finalresult.roleId || '',
            microsoftAccount: finalresult.isMicrosoftAccount ?? false // Ensures boolean default
          });
        }
        else {
            // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        }
    });
}


   getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
        case agent.indexOf('edge') > -1:
            return 'edge';
        case agent.indexOf('opr') > -1 && !!(<any>window).opr:
            return 'opera';
        case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
            return 'chrome';
        case agent.indexOf('trident') > -1:
            return 'ie';
        case agent.indexOf('firefox') > -1:
            return 'firefox';
        case agent.indexOf('safari') > -1:
            return 'safari';
        default:
            return 'other';
    }
  }
    Getroles(){
      var LoginId= parseInt(localStorage.getItem("LoginId"));
      this.authService.GetRoles(1,0,LoginId,1).subscribe(
        response => {
          debugger
          console.log("role,",response)
          if (JSON.parse(response) ) {
    const data=JSON.parse(response);
            this.Rolesdata = data.result;
          } else {
            this.Rolesdata = []; // Default to an empty array if the response is not in the expected format
            console.error('Unexpected response format:', response);
          }
        },
        error => {
          console.error('Error saving form', error);
        }
      );
    
    }
  
    Getopertaors(): void {
      debugger
      var loginId = localStorage.getItem("LoginId");
      var RoleId = localStorage.getItem("RoleId");
      var SiteId = localStorage.getItem("SiteId");

      this.authService.Getoperators(1, 10, loginId, RoleId, SiteId).subscribe(
        response => {
          if (response || Array.isArray(response)) {
            response=JSON.parse(response);
    
  debugger
            for (var i = 0; i < response.length; i++) {
  
            if (response) {
              this.operatordata.push({
  
                  id: response[i].id,
                  firstName: response[i].firstName
              })
            }
          }
            //this.operatordata = response; // Store the response in the operatordata array
          } else {
            console.error('Invalid response format:', response);
          }
          console.log('Form submitted successfully', response);
        },
        error => {
          console.error('Error saving form', error);
          alert('Error . Please try again.');
        }
      );
    }
  
    onSubmit() {
          debugger;
          if (this.operatorUserForm.invalid) {
              return;
          }
          var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
        
          var data = {
            Id:parseInt(this.editid) ,
              FirstName: this.operatorUserForm.value?.userName,
              LastName:  this.operatorUserForm.value?.userName,
              Email:this.operatorUserForm.value?.email,
              ContactNumber:this.operatorUserForm.value?.mobileNumber,
              Address1:"Address",
              Address2:"Address",
              City:"city",
              State:"state",
              CountryId:1,
              ZipCode:"1234",
              Active:true,
              IsOperator:true,
              IsSiteUser:false,
              OperatorId:this.operatorUserForm.value?.operators,
              IsMicrosoftAccount:this.operatorUserForm.value?.microsoftAccount,
              RoleId:String(parseInt(this.operatorUserForm.value?.role)),
              LoginId: parseInt(localStorage.getItem("LoginId")),
              EmailCode:emailcode.toString()
          }
          this.authService.UpdateregisUser(data).subscribe((data: any) => {
              debugger;
              var result = JSON.parse(data);
              if (result.status == "200") {
                  this.notifications.success('Success',"User Updated successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false, clickToClose: true });
                  setTimeout(() => {
                      this.modalRef.hide();
                  }, 2000);
                 
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
                  setTimeout(() => {
                    this.router.navigateByUrl('app/operatorconfig/operatoruser');
                  }, 1000);
  
              }
              else {
                  this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                 
              }
          }, (error) => {
              this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
  
          });
      }
  
    // onSubmit() {
    //   debugger
    //   if (this.operatorUserForm.valid) {
  
       
    //     const formData = new FormData();
    //     formData.append('RoleId',String(parseInt(this.operatorUserForm.value?.role)) );
    //     formData.append('Email',  this.operatorUserForm.value?.email);
    //     formData.append('ContactNumber',  this.operatorUserForm.value?.mobileNumber);
    //     formData.append('FirstName',  this.operatorUserForm.value?.userName);
  
  
    //     this.authService.SaveOperatorUser(formData).subscribe((finalresult: any) => {
                    
    //       if (finalresult.status == "200") {
  
    //     console.log("succeesss")
    //     }
       
  
    //   })
    // }
    // };
    onCancel() {
      this.operatorUserForm.reset();
    }
    cancel() {
      this.router.navigateByUrl('app/operatorconfig/operatoruser');
    }
  }