import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-editvehicleregistration',
    templateUrl: './editvehicleregistration.component.html'
})
export class EditVehicleRegistrationComponent implements OnInit, OnDestroy {
    vehicleregistersubmitted = false;
    vehicleregisterForm: FormGroup;
    bayno1:string;
    vehicleno1:string;
    startfromdate1:string;
    enddate1:string;
    bayno2:string;
    vehicleno2:string;
    startfromdate2:string;
    enddate2:string;
    VehicleRegistrationId:any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    sites: any = [];
    siteId: string;
    constructor(private spinner:NgxSpinnerService,private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.vehicleregisterForm = this.formBuilder.group({
            dname: ['', Validators.required]
        });

    }
    get r() { return this.vehicleregisterForm.controls; }

    ngOnInit() {
        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.GetSites();
        this.Edit(id, value);
    }
    canceladdvehicleregistration() {
        this.router.navigateByUrl('app/vehicleconfig/vehicleregistration');
    }
    ngOnDestroy() {

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
    Edit(id: any, value: any) {
        if (value == "view") {
            (document.getElementById("txtsitename") as HTMLInputElement).disabled = true;
            (document.getElementById("txtsiteaddress") as HTMLInputElement).disabled = true;
            (document.getElementById("txtcity") as HTMLInputElement).disabled = true;
            (document.getElementById("txtstate") as HTMLInputElement).disabled = true;
            (document.getElementById("txtzipcode") as HTMLInputElement).disabled = true;
            (document.getElementById("txtcontactpersonname") as HTMLInputElement).disabled = true;
            (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
            (document.getElementById("txtcontactnumber") as HTMLInputElement).disabled = true;
            (document.getElementById("txtmobilenumber") as HTMLInputElement).disabled = true;
            (document.getElementById("userchkactive") as HTMLInputElement).disabled = true;
            (document.getElementById("txttenantparkingbay") as HTMLInputElement).disabled = true;
            (document.getElementById("txtvisitorparkingbay") as HTMLInputElement).disabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            (document.getElementById("txtsitename") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsiteaddress") as HTMLInputElement).disabled = false;
            (document.getElementById("txtcity") as HTMLInputElement).disabled = false;
            (document.getElementById("txtstate") as HTMLInputElement).disabled = false;
            (document.getElementById("txtzipcode") as HTMLInputElement).disabled = false;
            (document.getElementById("txtcontactpersonname") as HTMLInputElement).disabled = false;
            (document.getElementById("txtemail") as HTMLInputElement).disabled = false;
            (document.getElementById("txtcontactnumber") as HTMLInputElement).disabled = false;
            (document.getElementById("txtmobilenumber") as HTMLInputElement).disabled = false;
            (document.getElementById("userchkactive") as HTMLInputElement).disabled = false;
            (document.getElementById("txttenantparkingbay") as HTMLInputElement).disabled = false;
            (document.getElementById("txtvisitorparkingbay") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.VehicleRegistrationId = id;
        this.authService.GetDataSourceById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
              // this.datasourcename = finalresult.result.name;
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    spinnerload() {
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    
      ngAfterViewInit(): void {
        this.spinnerload();
      }
    UpdateVehicleRegistration() {
        this.spinner.show();
       // this.datasourcesubmitted = true;
        // if (this.datasourceForm.invalid) {
        //     if (this.datasourcename == undefined || this.datasourcename == null || this.datasourcename == "") {
        //         document.getElementById("txtdatasourcename").className = "invalid-color";
        //     }
        //     this.spinner.hide();
        //     return;
        // }
        var data = {
          //  Name: this.datasourcename,
           // LoginId: parseInt(localStorage.getItem("LoginId")),
          //  Id: parseInt(this.DatasourceId)
        }
        this.authService.UpdateDataSource(data).subscribe((data: any) => {
           
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Vehicle Registration Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

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