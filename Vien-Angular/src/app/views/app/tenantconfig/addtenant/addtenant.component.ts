import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-addtenant',
    templateUrl: './addtenant.component.html',
    providers: [
        [DatePipe]
    ]
})
export class AddTenantComponent implements OnInit, OnDestroy {
    tenantsubmitted = false;
    tenantForm: FormGroup;
    firstname: string;
    lastname: string;
    siteId: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    houseorflatno: string;
    mobilenumber: string;
    email: string;
    parkingbayId: any;
    password: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    code: string;
    Id: number;
    bayconfigdiv = 'none';
    sites: any = [];
    bayconfigs: any = [];
    baynos: any = [];
    vehiclereg:string;
    baynonew: number;
    vehiclesperbay: string;
    mindate = new Date();
    numbers: number[];
    filelists: any = [];
    file: File;
    arrayBuffer: any;
    filerecordsdiv = 'none';
    files: Array<any> = new Array<any>();
    fileToUpload1: File = null;
    fileToUpload2: File = null;
    dateSelected = [];

    constructor(private datePipe: DatePipe, private translate: TranslateService, private spinner: NgxSpinnerService, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.tenantForm = this.formBuilder.group({
            rfirstname: ['', Validators.required],
            rlastname: ['', Validators.required],
            rsiteId: ['', Validators.required],
            raddress: ['', Validators.required],
            rhouseorflatno: ['', Validators.required],
            rcity: ['', Validators.required],
            rstate: ['', Validators.required],
            rzipcode: ['', Validators.required],
            rmobilenumber: ['', Validators.required],
            remail: ['', [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
            rparkingbayId: ['', Validators.required],
            Pprofile1:[''],
            Pprofile2:['']


        });
      //  this.numbers = Array(261).fill(0,0,261).map((x,i)=>i);

    }
    get r() { return this.tenantForm.controls; }
    ngOnInit() {
        this.agent = this.getBrowserName();

        this.siteId = "";
        this.parkingbayId = "0";
        var element = document.getElementById("loading") as HTMLDivElement;
        // element.style.display = 'block';
        this.GetSites();
    }

    agent

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
    canceladdtenant() {
        this.router.navigateByUrl('app/tenantconfig/tenant');
    }
    ngOnDestroy() {

    }
    onSuccess(msg) {
        this.notifications.create(this.translate.instant('Success'),
            this.translate.instant(msg), NotificationType.Success,
            { timeOut: 3000, showProgressBar: true });
    }
    errormsg(msg) {
        this.notifications.create(this.translate.instant('Error'),
            this.translate.instant(msg), NotificationType.Error, {
            timeOut: 3000,
            showProgressBar: true
        });
    }
    alert(msg) {
        this.notifications.create(this.translate.instant('Alert'),
            this.translate.instant(msg), NotificationType.Alert, {
            timeOut: 3000,
            showProgressBar: true
        });
    }
    BindBayNo() {
        debugger;

        if (this.siteId != null || this.siteId != undefined || this.siteId != "") {
            if (this.parkingbayId != "0") {
                for (var j = 0; j < this.sites.length; j++) {
                    if (this.siteId == this.sites[j].id) {
                        this.vehiclesperbay = this.sites[j].vehiclesperbay;
                    }

                }
                var j = 0;
                this.bayconfigs = [];
                // this.GetParkingBayNos(this.siteId)
                
            
                for (var i = 0; i < this.parkingbayId; i++) {
                    j++;
                    this.bayconfigs.push({
                        id: j,
                        bayid: '',
                        vehiclesperbay: this.vehiclesperbay,
                        startdate: '',
                        enddate: '',
                        baynos: [],
                        vehiclereg:'',
                    })
                }
            //}
                this.bayconfigdiv = 'block';
            }
            else {
                this.bayconfigdiv = 'none';
            }
        }
    }
    // BindBaynos(id) {
    //     debugger;
    //     let newid = id - 1;
    //     if (this.bayconfigs[newid].startdate == '') {

    //     }
    //     else if (this.siteId != null || this.siteId != undefined || this.siteId != "") {
    //         var element = document.getElementById("loading") as HTMLDivElement;
    //         element.style.display = 'block';
    //         var date = this.bayconfigs[newid].startdate;

    //         var newdate = this.datePipe.transform(date, "yyyy-MM-dd");

    //         this.authService.GetParkingBayNo(this.siteId, newdate).subscribe((result: any) => {
    //             debugger;
    //             var finalresult = JSON.parse(result);
    //             if (finalresult.status == "200") {
    //                 element.style.display = 'none';
    //                 this.baynos = finalresult.result;
    //                 this.bayconfigs[newid].baynos = finalresult.result;
    //             }
    //             element.style.display = 'none';
    //         });
    //         element.style.display = 'none';
    //         this.AvoidDuplicate(this.bayconfigs[id].bayid, newid);
    //     }
    //     else {
    //         this.alert("site is required");
    //     }
    // }

    onSelectFile1(files: FileList) {
        if (files.length === 0)
            return;
        if (files.length > 0) {
            this.files = [];
            for (var i = 0; i < files.length; i++) {
                this.fileToUpload1 = files.item(i);
                const fileReader: FileReader = new FileReader();
                fileReader.readAsDataURL(this.fileToUpload1);
                this.files.push({ data: this.fileToUpload1, fileName: this.fileToUpload1.name });
            }
    
        }
    
    }
    onSelectFile2(files: FileList) {
        if (files.length === 0)
            return;
        if (files.length > 0) {
            this.files = [];
            for (var i = 0; i < files.length; i++) {
                this.fileToUpload2 = files.item(i);
                const fileReader: FileReader = new FileReader();
                fileReader.readAsDataURL(this.fileToUpload2);
                this.files.push({ data: this.fileToUpload2, fileName: this.fileToUpload2.name });
            }
    
        }
    
    }

    BindBaynoswithenddate(id) {
        debugger;
        let newid = id - 1;
        if (this.bayconfigs[newid].startdate == '' && this.bayconfigs[newid].enddate == '') {

        }
        else if (this.siteId != null || this.siteId != undefined || this.siteId != "") {
            var element = document.getElementById("loading") as HTMLDivElement;
            element.style.display = 'block';
            var date = this.bayconfigs[newid].startdate;
            var enddate = this.bayconfigs[newid].enddate;

            var newdate = this.datePipe.transform(date, "yyyy-MM-dd");
            var enddate1 = this.datePipe.transform(enddate, "yyyy-MM-dd");

            this.authService.GetParkingBayNo(this.siteId, newdate, enddate1).subscribe((result: any) => {
                debugger;
                var finalresult = JSON.parse(result);
                if (finalresult.status == "200") {
                    element.style.display = 'none';
                    this.baynos = finalresult.result;
                    this.bayconfigs[newid].baynos = finalresult.result;
                }
                element.style.display = 'none';
            });
            element.style.display = 'none';
            this.AvoidDuplicate(this.bayconfigs[id].bayid, newid);
        }
        else {
            this.alert("site is required");
        }
    }

    setBay(id){
        debugger
        const result=this.sites.filter((item)=>item.id==id)
        const bays=result[0].bays
        console.log("selectedBay",bays)
        this.numbers = Array(bays).fill(0,0,261).map((x,i)=>i);
    }
    GetSites() {
        var element = document.getElementById("loading") as HTMLDivElement;
        // element.style.display = 'block';
        var SiteId = localStorage.getItem("SiteId");
        var RoleId = localStorage.getItem("RoleId");
        this.authService.GetSites(1, 0, 1, RoleId, SiteId).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            console.log("forbay",finalresult)
            if (finalresult.status == "200") {
                element.style.display = 'none';

                if (true) {
                    for (var i = 0; i < finalresult.result.length; i++) {

                        if (finalresult.result[i].isActive == true) {
                            this.sites.push({

                                id: finalresult.result[i].id,
                                siteName: finalresult.result[i].siteName,
                                vehiclesperbay: finalresult.result[i].maxVehiclesPerBay,
                                bays:finalresult.result[i].noOfTotalBay
                            })
                        }

                    }
                }
                else {
                    this.sites = finalresult.result;
                }
            }
            // element.style.display = 'none';
        });
    }
    // GetParkingBayNos(Id) {
    //     var element = document.getElementById("loading") as HTMLDivElement;
    //     element.style.display = 'block';
    //     this.authService.GetParkingBayNo(Id).subscribe((result: any) => {
    //         debugger;
    //         var finalresult = JSON.parse(result);
    //         if (finalresult.status == "200") {
    //             element.style.display = 'none';
    //             this.baynos = finalresult.result;

    //         }
    //         element.style.display = 'none';
    //     });
    //     element.style.display = 'none';
    // }

    AvoidDuplicate(Id, indexid) {

        var element = document.getElementById("loading") as HTMLDivElement;
        //element.style.display = 'block';
        var newid = indexid - 1;
        debugger;
        var bayno = '';
        if (Id != "") {
            for (var i = 0; i < this.bayconfigs.length; i++) {
                if (this.bayconfigs[i].bayid == Id) {
                    bayno = this.bayconfigs[i].bayid;
                }
            }
            this.baynonew = parseInt(bayno);
            for (var i = 0; i < this.bayconfigs.length; i++) {

                if (this.bayconfigs[i].id != indexid) {

                    for (var j = 0; j < this.bayconfigs[newid].baynos.length; j++) {
                        if (this.bayconfigs[newid].baynos[j].id == bayno) {
                            var disable = (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement);
                            if (disable != null) {
                                (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement).disabled = true;
                            }
                        }
                        else {
                            var disable1 = (document.getElementById("txtoptionbay_" + this.bayconfigs[newid].baynos[j].id + "" + this.bayconfigs[i].id + "") as HTMLInputElement);
                            if (disable1 != null) {
                                (document.getElementById("txtoptionbay_" + this.bayconfigs[newid].baynos[j].id + "" + this.bayconfigs[i].id + "") as HTMLInputElement).disabled = false;
                            }
                        }
                    }

                }
                else if (this.bayconfigs[i].id == indexid) {

                    for (var j = 0; j < this.bayconfigs[newid].baynos.length; j++) {

                        (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement).disabled = false;

                    }

                }
            }
            // element.style.display = 'none';
        }
        else {
            for (var i = 0; i < this.bayconfigs.length; i++) {

                if (this.bayconfigs[i].id == indexid) {

                    this.bayconfigs[i].bayid = "";
                    for (var j = 0; j < this.bayconfigs[newid].baynos.length; j++) {
                        var disable3 = (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement);
                        if (disable3 != null) {
                            (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement).disabled = false;
                        }
                    }

                }
            }
            //  element.style.display = 'none';
        }
    }
    
    getDateslist(startDate, stopDate) {
        var dateArray = [];
        //startDate = new Date(startDate);
        //stopDate = new Date(stopDate);
        var currentDate =  new Date(new Date(startDate).setHours(0, 0, 0));
        var endDate =  new Date(new Date(stopDate).setHours(0, 0, 0));
        while (currentDate <= endDate) {
          dateArray.push(new Date(+currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      }

    SaveTenant() {
        debugger;
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';

        this.tenantsubmitted = true;
        if (this.tenantForm.invalid) {
            if (this.siteId == undefined || this.siteId == null || this.siteId == "") {
                document.getElementById("txtsite").className = "invalid-color";
            }
            if (this.firstname == undefined || this.firstname == null || this.firstname == "") {
                document.getElementById("txtfirstname").className = "invalid-color";
            }
            if (this.lastname == undefined || this.lastname == null || this.lastname == "") {
                document.getElementById("txtlastname").className = "invalid-color";
            }
            if (this.houseorflatno == undefined || this.houseorflatno == null || this.houseorflatno == "") {
                document.getElementById("txthouseorflatno").className = "invalid-color";
            }
            if (this.address == undefined || this.address == null || this.address == "") {
                document.getElementById("txtaddress").className = "invalid-color";
            }
            if (this.city == undefined || this.city == null || this.city == "") {
                document.getElementById("txtcity").className = "invalid-color";
            }
            if (this.state == undefined || this.state == null || this.state == "") {
                document.getElementById("txtstate").className = "invalid-color";
            }
            if (this.zipcode == undefined || this.zipcode == null || this.zipcode == "") {
                document.getElementById("txtzipcode").className = "invalid-color";
            }
            if (this.mobilenumber == undefined || this.mobilenumber == null || this.mobilenumber == "") {
                document.getElementById("txtmobilenumber").className = "invalid-color";
            }
            if (this.email == undefined || this.email == null || this.email == "") {
                document.getElementById("txtemail").className = "invalid-color";
            }
            if (this.parkingbayId == undefined || this.parkingbayId == null || this.parkingbayId == "") {
                document.getElementById("txtparkingbay").className = "invalid-color";
            }
            element.style.display = 'none';
            return;
        }
        debugger;
        var bayconfigsobjnew = [];
        for (var i = 0; i < this.bayconfigs.length; i++) {
            if (this.bayconfigs[i].bayid == "") {
                document.getElementById("txtbayno_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                element.style.display = 'none';
                return;
            }
            else {
                document.getElementById("txtbayno_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if (this.bayconfigs[i].vehiclesperbay == "") {
                document.getElementById("txtvehiclesperbay_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                element.style.display = 'none';
                return;
            }
            else {
                this.bayconfigs[i].vehiclesperbay = this.bayconfigs[i].vehiclesperbay.toString();
                document.getElementById("txtvehiclesperbay_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if (this.bayconfigs[i].startdate == "") {
                document.getElementById("txtstartdate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                element.style.display = 'none';
                return;
            }
            else {
                debugger;
                var startdate = this.bayconfigs[i].startdate;
                this.bayconfigs[i].startdate = this.datePipe.transform(startdate, "yyyy-MM-dd");
                // this.bayconfigs[i].startdate=startdate.getFullYear()+"-"+(startdate.getMonth() + 1)+"-"+startdate.getDate();
                document.getElementById("txtstartdate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if (this.bayconfigs[i].enddate == "") {
                document.getElementById("txtenddate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                element.style.display = 'none';
                return;
            }
            else {
                var enddate = this.bayconfigs[i].enddate;
                this.bayconfigs[i].enddate = this.datePipe.transform(enddate, "yyyy-MM-dd");
                // this.bayconfigs[i].enddate=enddate.getFullYear()+"-"+(enddate.getMonth() + 1)+"-"+enddate.getDate();
                document.getElementById("txtenddate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if(this.bayconfigs[i].vehiclereg!=""){
                this.bayconfigs[i].vehiclereg = this.bayconfigs[i].vehiclereg.toString();
                document.getElementById("txtvehiclereg_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            
          
            if (this.bayconfigs[i].enddate != "" && this.bayconfigs[i].startdate != "") {
                let date1 = this.datePipe.transform(this.bayconfigs[i].startdate, "dd-MM-yyyy");
                let date2 = this.datePipe.transform(this.bayconfigs[i].enddate, "dd-MM-yyyy");
                var newfromdate = date1.split("-").reverse().join("-");
                var newtodate = date2.split("-").reverse().join("-");
                var dateObjFrom = new Date(newfromdate);
                var dateObjTo = new Date(newtodate);
                if (dateObjFrom > dateObjTo) {
                    this.alert("end date should be greater than start date");
                    element.style.display = 'none';

                    return;
                }
            }
            this.dateSelected = this.getDateslist(this.bayconfigs[i].startdate, this.bayconfigs[i].enddate);
            if (this.bayconfigs[i].startdate != "" && this.bayconfigs[i].enddate != "" && this.bayconfigs[i].bayid != "" && this.bayconfigs[i].vehiclesperbay != "") {
                // bayconfigsobjnew.push(
                //     this.bayconfigs[i]);
                var bayconfigid = 0;
                if (this.bayconfigs[i].bayconfigid == ""|| this.bayconfigs[i].bayconfigid == undefined || this.bayconfigs[i].bayconfigid == "undefined") {
                    bayconfigid = 0;
                }
                else {
                    bayconfigid = this.bayconfigs[i].bayconfigid;
                }
                bayconfigsobjnew.push({
                    id: this.bayconfigs[i].id,
                    bayid: this.bayconfigs[i].bayid,
                    bayconfigid: bayconfigid,
                    vehiclesperbay: this.bayconfigs[i].vehiclesperbay,
                    startdate: this.bayconfigs[i].startdate,
                    enddate: this.bayconfigs[i].enddate,
                    vehiclereg:this.bayconfigs[i].vehiclereg,
                    dates: this.dateSelected.toString(),
                });

            }

        }
        var emailcode = Math.floor(100000 + Math.random() * 900000) + 1;
        this.code = emailcode.toString();
        var loginId = localStorage.getItem("LoginId");
        if (loginId == "null" || loginId == undefined || loginId == null) {
            this.Id = 0;
        }
        else {
            this.Id = parseInt(loginId);
        }
        var _chk1=true;
        var check = document.getElementById("isupdateenddate") as HTMLInputElement;
        if (check.checked == true) {
            _chk1 = true;
        }
        else {
            _chk1= false;
        }
        debugger;

        // const formData: FormData = new FormData();
       
        // if (this.fileToUpload1!=null) {
        //     formData.append("fileupload1", this.fileToUpload1, this.fileToUpload1.name);
        // }
        
        // if (this.fileToUpload2!=null) {
        //     formData.append("fileupload2", this.fileToUpload2, this.fileToUpload2.name);
        // }

   

        var data = {
            FirstName: this.firstname,
            LastName: this.lastname,
            SiteId: this.siteId,
            Address: this.address,
            City: this.city,
            State: this.state,
            Zipcode: this.zipcode,
            MobileNumber: this.mobilenumber,
            HouseOrFlatNo: this.houseorflatno,
            Email: this.email,
            ParkingBay: this.parkingbayId,
            Password: this.password,
            EmailCode: this.code,
            ParentId: this.Id,
            //BayConfigs: this.bayconfigs,
            BayConfigs: bayconfigsobjnew,
            IsupdateEnddate : _chk1,
            LoginId:localStorage.getItem("LoginId")
        }
        console.log(data);
        this.authService.SaveTenantUser(data).subscribe((data: any) => {
            var element = document.getElementById("loading") as HTMLDivElement;
            element.style.display = 'block';
            
            var result = JSON.parse(data);
            // console.log(data);
            

            if (result.status == "200") {
                const formData: FormData = new FormData();
                if (this.fileToUpload1!=null) {
                    formData.append("fileupload1", this.fileToUpload1, this.fileToUpload1.name);
                }
                
                if (this.fileToUpload2!=null) {
                    formData.append("fileupload2", this.fileToUpload2, this.fileToUpload2.name);
                }
                var id= result.result.id;
                 formData.append("Id",id);


                this.authService.SaveTenantUseruploads(formData).subscribe((finalresult: any) => {
                    //var result = JSON.parse(finalresult);
            // console.log(data);
            
            //var id= result.result.id;

            if (finalresult.status == "200") {

                var objreq = {
                    Agent: this.agent,
                    RegisterUserId: parseInt(localStorage.getItem("LoginId")),
                    RoleId: localStorage.getItem("RoleId"),
                    Operation: "save tanant details" + this.firstname + '' + this.lastname,
                    Function: "save tenant",
                    TenantId: parseInt(id)
                }

            


                //this.notifications.success('Success', "Tenant registered successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });
                this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
                    element.style.display = 'none';
                    this.onSuccess("Tenant registered successfully");
                    setTimeout(() => {
                        this.router.navigateByUrl('app/tenantconfig/tenant');
                    }, 1000);
                })
            }

        })


            }
            else {
                element.style.display = 'none';
                this.alert(result.message);
                // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

            }
        }, (error) => {
            element.style.display = 'none';
            this.errormsg(error.message);
            // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }





}