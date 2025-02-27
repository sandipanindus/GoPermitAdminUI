import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input, AbstractType } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-bulkupload',
    templateUrl: './bulkupload.component.html'
})
export class BulkUploadComponent implements OnInit, OnDestroy {
    active: boolean;
    bulkuploadsubmitted = false;
    bulkuploadForm: FormGroup;
    bulkupload: string;
    filerecordsdiv = 'none';
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    file: File;
    arrayBuffer: any;
    filelists: any = [];
    importdata: any = [];
    Id: any;
    code: any;
    constructor(private spinner: NgxSpinnerService,private translate: TranslateService, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {


    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }
    SaveData() {
        debugger;
        this.spinner.show();
        var loginId = localStorage.getItem("LoginId");
        if (loginId == "null" || loginId == undefined || loginId == null) {
            this.Id = 0;
        }
        else {
            this.Id = parseInt(loginId);
        }
        this.importdata = [];
        for (var i = 0; i < this.filelists.length; i++) {
            var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
            this.code = emailcode.toString();
            var zipcode = this.filelists[i].Zipcode;

            if (zipcode != undefined) {
                zipcode = zipcode.toString();
            }
            else {
                zipcode = "";
            }


            var MobileNumber = this.filelists[i].MobileNumber;

            if (MobileNumber != undefined) {
                MobileNumber = MobileNumber.toString();
            }
            else {
                MobileNumber = "";
            }
            var ParkingBayNo = this.filelists[i].ParkingBayNo;

            if (ParkingBayNo != undefined) {
                ParkingBayNo = ParkingBayNo.toString();
            }
            else {
                ParkingBayNo = "";
            }
            this.importdata.push({
                FirstName: this.filelists[i].FirstName,
                LastName: this.filelists[i].LastName,
                SiteName: this.filelists[i].SiteName,
                Address: this.filelists[i].Address,
                City: this.filelists[i].City,
                SiteId:this.filelists[i].SiteId,
                State: this.filelists[i].State,
                Zipcode: zipcode,
                MobileNumber: MobileNumber,
                Email: this.filelists[i].Email,
                ParkingBay: String(this.filelists[i].ParkingBay),
                EmailCode: this.code,
                ParentId: this.Id
            });
        }
        this.authService.SaveBulkTenants(this.importdata).subscribe((data: any) => {

            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Tenant saved successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    window.location.reload();
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

    errormsg(msg) {
        this.notifications.create(this.translate.instant('Error'),
            this.translate.instant(msg), NotificationType.Error, {
            timeOut: 3000,
            showProgressBar: true
        });
    }

    onSuccess(msg) {
        this.notifications.create(this.translate.instant('Success'),
            this.translate.instant(msg), NotificationType.Success,
            { timeOut: 3000, showProgressBar: true });
    }

    addfile(event) {
        debugger;
        this.filelists = [];
        this.file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.file);
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
            var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            this.filelists = arraylist;
            this.filerecordsdiv = 'inline-block';

            if (!this.file) {
                this.errormsg("Please select a file.");
                return;
            }
            //  console.log(this.filelist)
       

        }
    }

    saveBulk(){
        const formData = new FormData();
        formData.append("file", this.file);

        this.authService.AddBulkTenantUser(formData).subscribe((data: any) => {
            if(data){
                this.onSuccess("Tenants Updated Successfully");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        },error=>{
            this.errormsg(error.message)
        })
    }
}