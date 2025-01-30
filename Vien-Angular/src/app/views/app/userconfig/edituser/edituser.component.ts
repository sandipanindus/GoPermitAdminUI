import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-edituser',
    templateUrl: './edituser.component.html'
})
export class EditUserComponent implements OnInit, OnDestroy {
    active: boolean;
    isdisabled = false;
    roleid: number;
    countryid: number;
    UserId: any;
    countries: any = [];
    roles: any = [];
    code: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
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
    fileToUpload: File = null;
    files: Array<any> = new Array<any>();
    profilepicture: any;
    constructor(private spinner: NgxSpinnerService, private translate: TranslateService,
        private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.userForm = this.formBuilder.group({
            rfirstname: ['', Validators.required],
            rlastname: ['', Validators.required],
            //remail: ['', [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
            rroleid: ['', Validators.required],
            remail:[''],
            rsite:[''],
            rcontactnumber:[''],
            raddress1:[''],
            raddress2:[''],
            rstate:[''],
            rcity:[''],
            rfileupload:[''],
            rzipcode:[''],
            rcountry:[''],
            ruserchkactive:[''],
        });
    }
    get r() { return this.userForm.controls; }
    ngOnInit() {
        // this.spinner.show();
        // this.roleId = "";
        // this.countryId = "";
        //this.siteId = "";
        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.GetSites();
        this.GetRoles();
        this.GetCountries();
        this.Edit(id, value);


    }
    spinnerload() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

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
    onSelectFile(files: FileList) {
        if (files.length === 0)
            return;
        if (files.length > 0) {
            this.files = [];
            for (var i = 0; i < files.length; i++) {
                this.fileToUpload = files.item(i);
                const fileReader: FileReader = new FileReader();
                fileReader.readAsDataURL(this.fileToUpload);
                this.files.push({ data: this.fileToUpload, fileName: this.fileToUpload.name });
            }

        }

    }
    GetSites() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        var LoginId = localStorage.getItem("LoginId");
        var RoleId = localStorage.getItem("RoleId");
        var SiteId = localStorage.getItem("SiteId");
        this.authService.GetSites(1, 0, LoginId, RoleId, SiteId).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
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
                }
                else{
                    this.sites=finalresult.result;
                }
            }
            element.style.display = 'none';
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

                this.alert(finalresult.message);
            }
        }, (error) => {

            this.error(error.message);

        });
    }
    GetCountries() {
        this.authService.GetCountries().subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.countries = finalresult.result;
            }
            else {
                // this.spinner.hide();          
                this.alert(finalresult.message);
            }
        }, (error) => {

            this.error(error.message);

        });
    }
    canceladduser() {
        this.router.navigateByUrl('app/userconfig/user');
    }
    ngOnDestroy() {

    }
    Edit(id, value) {
        var baseurl = this.authService.baseUrl;
        if(baseurl=="http://localhost:53846/api/"){
          baseurl="http://localhost:53846/";
    }
        // var baseurl="https://api.gopermit.co.uk";
        // var localbaseurl="http://localhost:53846/";
        if (value == "view") {

            this.buttonDisabled=true;
            this.userForm.controls['rfirstname'].disable();
            this.userForm.controls['rlastname'].disable();
            this.userForm.controls['rsite'].disable();
            this.userForm.controls['remail'].disable();
            this.userForm.controls['rcontactnumber'].disable();
            this.userForm.controls['raddress1'].disable();
            this.userForm.controls['raddress2'].disable();
            this.userForm.controls['rcountry'].disable();
            this.userForm.controls['rstate'].disable();
            this.userForm.controls['rcity'].disable();
            this.userForm.controls['rzipcode'].disable();
            this.userForm.controls['rroleid'].disable();
            this.userForm.controls['rfileupload'].disable();
            this.userForm.controls['ruserchkactive'].disable();

            // (document.getElementById("txtfirstname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtlastname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcontactnumber") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtaddress1") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtaddress2") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcountry") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtstate") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcity") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtrole") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtzipcode") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsite") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtfileupload") as HTMLInputElement).disabled = true;
            // var check = document.getElementById("userchkactive") as HTMLInputElement;
            // check.disabled = true;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {

            this.buttonDisabled=false;
            this.userForm.controls['rfirstname'].disable();
            this.userForm.controls['rlastname'].disable();
            this.userForm.controls['rsite'].disable();
            this.userForm.controls['remail'].disable();
            this.userForm.controls['rcontactnumber'].enable();
            this.userForm.controls['raddress1'].enable();
            this.userForm.controls['raddress2'].enable();
            this.userForm.controls['rcountry'].disable();
            this.userForm.controls['rstate'].enable();
            this.userForm.controls['rcity'].enable();
            this.userForm.controls['rzipcode'].enable();
            this.userForm.controls['rroleid'].disable();
            this.userForm.controls['rfileupload'].enable();
            this.userForm.controls['ruserchkactive'].enable();

            // (document.getElementById("txtfirstname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtlastname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcontactnumber") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtaddress1") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtaddress2") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtcountry") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtstate") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtcity") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtrole") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtzipcode") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtsite") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtfileupload") as HTMLInputElement).disabled = false;
            // this.isdisabled = false;
            // var check = document.getElementById("userchkactive") as HTMLInputElement;
            // check.disabled = false;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.UserId = id;
        this.authService.GetUsersById(this.UserId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            console.log(finalresult)
            debugger;
            if (finalresult.status == "200") {
                this.firstname = finalresult.result.firstName;
                this.lastname = finalresult.result.lastName;
                this.email = finalresult.result.email;
                this.contactnumber = finalresult.result.mobileNumber;
                this.address1 = finalresult.result.address;
                this.address2 = finalresult.result.address2;
                this.state = finalresult.result.state;
                this.city = finalresult.result.city;
                this.countryId = finalresult.result.countryId;
                this.siteId = finalresult.result.siteId;
                if (this.countryId == "0") {
                    this.countryId = "";
                }
                this.zipcode = finalresult.result.zipCode;
                this.roleId = finalresult.result.roleId;
                this.profilepicture = finalresult.result.profilePath;
                if(this.profilepicture!=null){
                    this.profilepicture=baseurl+finalresult.result.profilePath;
                }
                else{
                    this.profilepicture = finalresult.result.identityProofId;
                }
                if(this.profilepicture==null){
                    this.profilepicture=baseurl+"/TenantIdentityProofFiles/dummy identityproof.png";
                    }
                if (finalresult.result.isActive == true) {
                    var check = document.getElementById("userchkactive") as HTMLInputElement;
                    check.checked = true;
                }
                else {
                    var check = document.getElementById("userchkactive") as HTMLInputElement;
                    check.checked = false;
                }
                //  this.spinner.hide();
            }
            else {
                // this.spinner.hide();
                this.alert(finalresult.message);
            }
        });
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    UpdateUser() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        this.usersubmitted = true;
        if (this.userForm.invalid) {
            if (this.firstname == null || this.firstname == undefined || this.firstname == "") {
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
        const formData: FormData = new FormData();
        if (this.files.length == 1) {
            formData.append("fileupload", this.fileToUpload, this.fileToUpload.name);
        }
        // else if (this.files.length == 0) {
        //     element.style.display = 'none';
        //     this.alert("profile is required");
        //     return;
        // }
        //  var userinfo = localStorage.getItem("userinfo");
        //  var user = JSON.parse(userinfo);
        formData.append("Id", this.UserId);
        formData.append("FirstName", this.firstname);
        formData.append("LastName", this.lastname);
        formData.append("Email", this.email);
        formData.append("MobileNumber", this.contactnumber);
        formData.append("Address1", this.address1);
        formData.append("Address2", this.address2);
        formData.append("City", this.city);
        formData.append("State", this.state);
        formData.append("CountryId", this.countryid.toString());
        formData.append("Zipcode", this.zipcode);
        formData.append("RoleId", this.roleid.toString());
        formData.append("LoginId", localStorage.getItem("LoginId"));
        formData.append("EmailCode", '');
        formData.append("Active", this.active.toString());
        formData.append("SiteId", this.siteId);
        // var data = {
        //     Id: parseInt(this.UserId),
        //     FirstName: this.firstname,
        //     LastName: this.lastname,
        //     Email: this.email,
        //     ContactNumber: this.contactnumber,
        //     Address1: this.address1,
        //     Address2: this.address2,
        //     City: this.city,
        //     State: this.state,
        //     CountryId: this.countryid,
        //     ZipCode: this.zipcode,
        //     RoleId: this.roleid,
        //     LoginId: parseInt(localStorage.getItem("LoginId")),
        //     EmailCode: '',
        //     Active: this.active,
        //     SiteId: parseInt(this.siteId)
        // }

        this.authService.UpdateUser(formData).subscribe((data: any) => {
            var result = JSON.parse(data);
            if (result.status == "200") {
                element.style.display = 'none';
                this.onSuccess("User updated successfully");

                setTimeout(() => {
                   window.location.reload();
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