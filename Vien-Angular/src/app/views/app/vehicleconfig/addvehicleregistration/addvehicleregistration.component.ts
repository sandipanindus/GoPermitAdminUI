import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-addvehicleregistration',
    templateUrl: './addvehicleregistration.component.html'
})
export class AddVehicleRegistrationComponent implements OnInit, OnDestroy {

    vehicleregistersubmitted = false;
    vehicleregisterForm: FormGroup;
    bayno1: string;
    vehicleno1: string;
    startfromdate1: string;
    enddate1: string;
    bayno2: string;
    vehicleno2: string;
    startfromdate2: string;
    enddate2: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    sites: any = [];
    siteId: string;
    tenants: any = [];
    vehiclelists: any = [];
    tenantId: string;
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    sitename: string;
    zipcode: string;
    mobilenumber: string;
    address: string;
    parkingbayId: string;
    email: string;
    tenantlabeldiv = 'none';
    constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.vehicleregisterForm = this.formBuilder.group({
            dname: ['', Validators.required]
        });

    }
    get r() { return this.vehicleregisterForm.controls; }
    ngOnInit() {
        this.GetSites();
        this.siteId = "";
        this.tenantId = "";
        // this.GetTenants();
    }
    canceladdvehicleregistration() {
        this.router.navigateByUrl('app/vehicleconfig/vehicleregistration');
    }
    ngOnDestroy() {

    }
    BindTenantDetails() {
        this.spinner.show();
        if (this.tenantId != "") {
            var loginId = localStorage.getItem("LoginId");
            this.authService.GetTenantUserById(parseInt(this.tenantId)).subscribe((result: any) => {
                debugger;
                var finalresult = JSON.parse(result);
                if (finalresult.status == "200") {
                    this.firstname = finalresult.result.firstName;
                    this.lastname = finalresult.result.lastName;
                    this.city = finalresult.result.city;
                    this.state = finalresult.result.state;
                    this.zipcode = finalresult.result.zipCode;
                    this.mobilenumber = finalresult.result.mobileNumber;
                    this.siteId = finalresult.result.siteId;
                    this.address = finalresult.result.address;
                    this.parkingbayId = finalresult.result.parkingBay;
                    this.email = finalresult.result.email;
                    this.tenantlabeldiv = 'block';
                    this.spinner.hide();
                    var parkingbay = this.parkingbayId;
                    var j = 0;
                    this.vehiclelists = [];
                    for (var i = 0; i < parseInt(parkingbay); i++) {
                        j = j + 1;
                        this.vehiclelists.push({
                            id: j,
                            bayno:'',
                            make: '',
                            model: '',
                            vrm: '',
                            startDate: '',
                            endDate: '',
                            tenantId: parseInt(this.tenantId),
                            loginId: parseInt(loginId)
                        })
                    }
                }
                else {
                    this.spinner.hide();
                    this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                }
            });
        }
        else {
            this.spinner.hide();
            this.firstname = "";
            this.lastname = "";
            this.city = "";
            this.state = "";
            this.zipcode = "";
            this.mobilenumber = "";
            this.siteId = "";
            this.address = "";
            this.parkingbayId = "";
            this.email = "";
            this.tenantlabeldiv = 'none';
        }
    }
    GetSites() {
        this.authService.GetSites(1,0,1,1,0).subscribe((result: any) => {
            debugger;
            //  var data = JSON.stringify(result);
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.spinner.hide();
                this.sites = finalresult.result;
            }
            this.spinner.hide();
        });
    }
    GetTenants() {
        this.tenants = [];
        this.authService.GetTenantsBySite(parseInt(this.siteId)).subscribe((result: any) => {
            debugger;
            //  var data = JSON.stringify(result);
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.spinner.hide();
                this.tenants = finalresult.result;
            }
            this.spinner.hide();
        });
    }
    SaveVehicleData() {
        this.spinner.show();
        //  this.sitesubmitted = true;
        //  if (this.siteForm.invalid) {
        // if (this.datasourcename == undefined || this.datasourcename == null || this.datasourcename == "") {
        //     document.getElementById("txtdatasourcename").className = "invalid-color";
        //   }
        //   this.spinner.hide();
        //    return;
        //  }
        debugger;
        if (this.vehiclelists.length > 0) {
            for (var i = 0; i < this.vehiclelists.length; i++) {
                 if (this.vehiclelists[i].bayno == '') {
                    document.getElementById("txtbayno_" + this.vehiclelists[i].id + "").className = "form-control invalid-color";
                    this.spinner.hide();
                    return;
                }
                else {

                    document.getElementById("txtbayno_" + this.vehiclelists[i].id + "").className = "form-control";
                }
                // if (this.vehiclelists[i].make == '') {
                //     document.getElementById("txtmake_" + this.vehiclelists[i].id + "").className = "form-control invalid-color";
                //     this.spinner.hide();
                //     return;
                // }
                // else {

                //     document.getElementById("txtmake_" + this.vehiclelists[i].id + "").className = "form-control";
                // }
                // if (this.vehiclelists[i].model == '') {
                //     document.getElementById("txtmodel_" + this.vehiclelists[i].id + "").className = "form-control invalid-color";
                //     this.spinner.hide();
                //     return;
                // }
                // else {
                //     document.getElementById("txtmodel_" + this.vehiclelists[i].id + "").className = "form-control";

                // }
                // if (this.vehiclelists[i].vrm == '') {
                //     document.getElementById("txtvrm_" + this.vehiclelists[i].id + "").className = "form-control invalid-color";
                //     this.spinner.hide();
                //     return;
                // }
                // else {
                //     document.getElementById("txtvrm_" + this.vehiclelists[i].id + "").className = "form-control";
                // }
                if (this.vehiclelists[i].startDate == '') {
                   // document.getElementById("txtstartdate_" + this.vehiclelists[i].id + "").className = "form-control invalid-color";
                  //  this.spinner.hide();
                  //this.vehiclelists[i].startDate=new Date();
                  //  return;
                }
                else {

                    document.getElementById("txtstartdate_" + this.vehiclelists[i].id + "").className = "form-control";
                }
                if (this.vehiclelists[i].endDate == '') {
                   // document.getElementById("txtenddate_" + this.vehiclelists[i].id + "").className = "form-control invalid-color";
                  //  this.spinner.hide();
                 // this.vehiclelists[i].endDate=new Date();
                  //  return;
                }
                else {
                    let startdate=new Date(this.vehiclelists[i].startDate);
                    let enddate=new Date(this.vehiclelists[i].endDate);
                    if(enddate.toLocaleDateString()<startdate.toLocaleDateString()){
                        this.spinner.hide();
                        this.notifications.alert('Alert', "enddate should be greater than start date", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                        return;
                    }
                    document.getElementById("txtenddate_" + this.vehiclelists[i].id + "").className = "form-control";
                }



                // this.notifications.alert('Alert', "fill required fields", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });


            }

        }
        else {
            this.notifications.alert('Alert', "Required atleast one row", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        }
        this.authService.SaveVehicleData(this.vehiclelists).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Vehicle Registration added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/vehicleconfig/vehicleregistration']);
                }, 1000);

            }
            else {
                this.spinner.hide();
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

            }
        }, (error) => {
            this.spinner.hide();
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }
}