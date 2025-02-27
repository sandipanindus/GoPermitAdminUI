
  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
  import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
  import { AuthService } from 'src/app/shared/auth.service';
  import { NotificationsService, NotificationType } from 'angular2-notifications';
  import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
  
  
  @Component({
    selector: 'app-addsiteuser',
    templateUrl: './addsiteuser.component.html',
    styleUrls: ['./addsiteuser.component.scss']
  })
  export class AddsiteuserComponent implements OnInit {
    addSiteUserForm!: FormGroup;
   // Replace with actual values
    constructor( private router: Router,private fb: FormBuilder, private http: HttpClient,private notifications: NotificationsService, private authService: AuthService) {}
  Rolesdata:any[]=[];
  operatordata:any[] = [];
  selectedOperator: string;
  
   modalRef: BsModalRef;
  
  
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
  countries:any[]=[];
 @Input() itemOptionsPerPage = [20, 50, 100];

  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  sites: any = [];



  SiteId: any;
  showpage = false;
  message: string;
  totalItems;
  currentPage: number = 1;
  sortDir = 1;
  currentPageEvent = 1;
  page: number;

  limitsMaxSize = 10;
  limitsCurrentPage = 1;
  itemsPerPage: number = 10;
  totalPage: number;
  
  
    ngOnInit() {
      this.addSiteUserForm = this.fb.group({
        operatorid: [''],
        username: [''],
        email: ['', Validators.required],
        contactNumber: ['', Validators.required],
        role: ['', Validators.required],
        site: ['', Validators.required],
        Address1: ['', Validators.required],
        Address2: ['', Validators.required],
        Country: ['', Validators.required],
        State: ['', Validators.required],
        City: ['', Validators.required],
        postalcode: ['', Validators.required],
        microsoftAccount: [false],
        Active: [false],
  
  
      });
    
  
this.Getcountries();
  this.Getroles()
      this.Getopertaors()
     // this.GetSites()
    }
agent
    GetSites(id:any) {
      var loginId = localStorage.getItem("LoginId");
      var RoleId = localStorage.getItem("RoleId");
      var SiteId = localStorage.getItem("SiteId");
     
      this.authService.GetSitesbyoperatorid(this.currentPage, this.itemsPerPage, loginId, RoleId, SiteId,id).subscribe((result: any) => {
        debugger
        var finalresult = JSON.parse(result);
        if (finalresult.status == "200") {
          debugger;
          this.sites = finalresult.result;       
          var element = document.getElementById("loading") as HTMLDivElement;
          element.style.display = 'none';
          if (this.sites.length > 0) {
            this.totalItems = this.sites[0].totalItem;
            this.totalPage = this.sites[0].totalPage;
            if (this.totalItems > this.itemsPerPage) {
              this.showpage = true;
            }
            else {
              this.showpage = false;
            }
          }
          else {
            this.totalItems = 0;
            this.totalPage = 0;
            if(this.currentPage!=1){
            this.showpage = true;
            }
            else{
              this.showpage=false;
            }
  
          }
  
          var objreq={
            Agent:this.agent,
            RegisterUserId:parseInt(localStorage.getItem("LoginId")),
            RoleId:localStorage.getItem("RoleId"),
            Operation:"fetching all sites",
            Function:"Get allsite master list"
          }
              this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
          
              })
        }
        else {
         // this.alert(result.message);
        //  this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
  
        }
  
  
      });
  
    }
    Getcountries(){
      this.authService.GetCountries().subscribe(
        response => {
          debugger
          if (JSON.parse(response) ) {
    const data=JSON.parse(response);
            this.countries = data.result;
          } else {
            this.countries = []; // Default to an empty array if the response is not in the expected format
            console.error('Unexpected response format:', response);
          }
        },
        error => {
          console.error('Error saving form', error);
        }
      );
    
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

            this.Rolesdata= this.Rolesdata.filter((item)=>item.name=='Site User Admin')


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
    setsites(event: Event){
      const selectedValue = (event.target as HTMLSelectElement).value;
      this.GetSites(selectedValue)

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
          if (this.addSiteUserForm.invalid) {
              return;
          }
          var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
        
          var data = {
               FirstName: this.addSiteUserForm.value?.username,
              LastName:  this.addSiteUserForm.value?.username,
              Email:this.addSiteUserForm.value?.email,
              ContactNumber:this.addSiteUserForm.value?.contactNumber,
              Address1:this.addSiteUserForm.value?.Address1,
              Address2:this.addSiteUserForm.value?.Address2,
              City:this.addSiteUserForm.value?.City,
              State:this.addSiteUserForm.value?.State,
              CountryId:String(parseInt(this.addSiteUserForm.value?.Country)),
              ZipCode:this.addSiteUserForm.value?.postalcode,
              Active:true,
              IsMicrosoftAccount:this.addSiteUserForm.value?.microsoftAccount,
              IsOperator:false,
              IsSiteUser:true,
              OperatorId:this.addSiteUserForm.value?.operatorid,
              RoleId:String(parseInt(this.addSiteUserForm.value?.role)),
              SiteId:String(parseInt(this.addSiteUserForm.value?.site)),
              LoginId: parseInt(localStorage.getItem("LoginId")),
              EmailCode:emailcode.toString()
          }
          this.authService.AddUser(data).subscribe((data: any) => {
              debugger;
              var result = JSON.parse(data);
              if (result.status == "200") {
                  this.notifications.success('Success',"User added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false, clickToClose: true });
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
                    this.router.navigateByUrl('app/siteconfig/siteuser');
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
      this.addSiteUserForm.reset();
    }
    cancel() {
      this.router.navigateByUrl('app/siteconfig/siteuser');
    }
  }
