import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { formatWithOptions } from 'util';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-adduser',
    templateUrl: './adduser.component.html'
})
export class AddUserComponent implements OnInit, OnDestroy {
    active: boolean;
    countries: any = [];
    roles: any = [];
    roleid: number;
    countryid: number;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    code: string;
    usersubmitted = false;
    userForm: FormGroup;
    firstname: string;
    lastname: string;
    email: string;
    contactnumber: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    countryId: string;
    zipcode: string;
    roleId: string;
    siteId: string;
    sites: any = [];
    sitesdrop: any = [];
    dropdownsites: any;
    dropdownList:any;
    selecteditems: any;
    selecteditemsarray:any = [];
    
    //{ singleSelection: boolean; idField: string; textField: string; enableCheckAll: boolean; selectAllText: string; unSelectAllText: string; allowSearchFilter: boolean; limitSelection: number; clearSearchFilter: boolean; maxHeight: number; itemsShowLimit: number; searchPlaceholderText: string; noDataAvailablePlaceholderText: string; closeDropDownOnSelection: boolean; showSelectedItemsAtTop: boolean; defaultOpen: boolean; };
    constructor(private spinner: NgxSpinnerService, private translate: TranslateService,
        private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {

        this.userForm = this.formBuilder.group({
            rfirstname: ['', Validators.required],
            rlastname: ['', Validators.required],
            remail: ['', [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
            rroleid: ['', Validators.required],
            rsiteid: ['', Validators.required]
        });

    }
    get r() { return this.userForm.controls; }
    ngOnInit() {
        // this.spinner.show();
        this.roleId = "";
        this.countryId = "";
        this.siteId = "";
        this.GetRoles();
        this.GetSites();
        this.Getcountries();
    }
    GetSites() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        var LoginId = localStorage.getItem('LoginId');
        var RoleId = localStorage.getItem("RoleId");
        this.authService.GetSites(1, 0, LoginId, RoleId, 0).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            console.log(finalresult)
            if (finalresult.status == "200") {
                element.style.display = 'none';

                if (RoleId == "1") {
                    for (var i = 0; i < finalresult.result.length; i++) {

                        if (finalresult.result[i].isActive == true) {
                            this.sites.push({
                                id: finalresult.result[i].id,
                                siteName: finalresult.result[i].siteName
                            })
                            
                        }

                    }
                    console.log(this.sites);
                    // this.sitesdrop = Object.keys(this.sites).map(index => {
                    //     let person = this.sites[index];
                    //     return person;
                    // });
                    //console.log('testarray',this.sitesdrop)
                    
                    //this.sitesdrop = Object.keys(this.sites).map(key => ({ value: this.sites[key]}));
                    //console.log ('array',this.sitesdrop)
                            // this.dropdownsites = {
                            //     singleSelection: false,
                            //     idField: 'id',
                            //     textField: 'siteName',
                            //     enableCheckAll: true,
                            //     selectAllText: 'Select All',
                            //     unSelectAllText: 'Un Select All',
                            //     allowSearchFilter: true,
                            //     limitSelection: -1,
                            //     clearSearchFilter: true,
                            //     maxHeight: 197,
                            //     itemsShowLimit: 1,
                            //     searchPlaceholderText: 'Search',
                            //     noDataAvailablePlaceholderText: 'NO data',
                            //     closeDropDownOnSelection: false,
                            //     showSelectedItemsAtTop: false,
                            //     defaultOpen: false
                            //   }
                    
                } else {
                    this.sites = finalresult.result;
                }
            }
            element.style.display = 'none';
        });
    }
    spinnerload() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }
    // onItemSelect(item: any) {
    //     //debugger
    //     //console.log('onItemSelect', item);
    //     this.selecteditemsarray.push({
    //         id: item.id,
    //         //siteName:item.siteName
    //     });
    //      console.log('onItemSelectarray', this.selecteditemsarray);
    // }
    // onSelectAll(items: any) {
    //     this.selecteditemsarray.push({
    //         id: '0',
    //         //siteName:item.siteName
    //     });
    //     console.log('onSelectAll', items);
    // }
    

    ngAfterViewInit(): void {
        // this.spinnerload();
    }
    onSuccess(msg) {
        this.notifications.create(this.translate.instant('alert.success'),
            this.translate.instant(msg), NotificationType.Success,
            { timeOut: 3000, showProgressBar: true });
    }
    error(msg) {
        this.notifications.create(this.translate.instant('alert.error'),
            this.translate.instant(msg), NotificationType.Error, {
            timeOut: 3000,
            showProgressBar: true
        });
    }
    alert(msg) {
        this.notifications.create(this.translate.instant('alert.alert'),
            this.translate.instant(msg), NotificationType.Alert, {
            timeOut: 3000,
            showProgressBar: true
        });
    }
    GetRoles() {
        var loginId = localStorage.getItem("LoginId");
        var RoleId=localStorage.getItem("RoleId");
        this.authService.GetRoles(1, 0, loginId, RoleId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.roles = finalresult.result;
                

            }
            else {
                // this.spinner.hide();
                this.alert(finalresult.message);
            }
        }, (error) => {
            // this.spinner.hide();
            this.error(error.message);

        });
    }
    Getcountries() {
        this.authService.GetCountries().subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.countries = finalresult.result;
                //  this.spinner.hide();
            }
            else {
                //this.spinner.hide();
                this.alert(finalresult.message);
            }
        }, (error) => {
            // this.spinner.hide();
            this.error(error.message);

        });
    }
    canceladduser() {
        this.router.navigateByUrl('app/userconfig/user');
    }
    ngOnDestroy() {

    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    AddUser() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        this.usersubmitted = true;
        if (this.userForm.invalid) {
            if (this.firstname == null || this.firstname == undefined || this.lastname == "") {
                document.getElementById("txtfirstname").className = "invalid-color";
            }
            if (this.lastname == null || this.lastname == undefined || this.lastname == "") {
                document.getElementById("txtlastname").className = "invalid-color";
            }
            if (this.email == null || this.email == undefined || this.email == "") {
                document.getElementById("txtemail").className = "invalid-color";
            }
            if (this.roleId == null || this.roleId == undefined || this.roleId == "") {

                document.getElementById("txtrole").className = "invalid-color";
            }
            if (this.siteId == null || this.siteId == undefined || this.siteId == "") {

                document.getElementById("txtsite").className = "invalid-color";
            }


            element.style.display = 'none';
            return;


        }
        this.roleid = parseInt(this.roleId);
        if (this.countryId == undefined || this.countryId == "" || this.countryId == null) {
            this.countryid = 0;
        } else {
            this.countryid = parseInt(this.countryId);
        }
        this.buttonDisabled = true;
        this.currentState = 'show-spinner';
        var check = document.getElementById("userchkactive") as HTMLInputElement;
        if (check.checked == true) {
            this.active = true;
        }
        else {
            this.active = false;
        }
        var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
        this.code = emailcode.toString();
        if (this.siteId == "") {
            this.siteId = "0";
        }
        var data = {
            FirstName: this.firstname,
            LastName: this.lastname,
            Email: this.email,
            ContactNumber: this.contactnumber,
            Address1: this.address1,
            Address2: this.address2,
            City: this.city,
            State: this.state,
            CountryId: this.countryid,
            Zipcode: this.zipcode,
            RoleId: this.roleid,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            EmailCode: this.code,
            Active: this.active,
            SiteId: parseInt(this.siteId)
        }
        this.authService.AddUser(data).subscribe((data: any) => {
            var result = JSON.parse(data);
            if (result.status == "200") {
                element.style.display = 'none';
                this.onSuccess("User saved successfully");

                setTimeout(() => {
                    this.router.navigate(['app/userconfig/user']);
                }, 1000);


            }
            else {
                element.style.display = 'none';
                this.alert(result.message);

            }
        }, (error) => {
            element.style.display = 'none';
            this.error(error.message);

        });
    }
}