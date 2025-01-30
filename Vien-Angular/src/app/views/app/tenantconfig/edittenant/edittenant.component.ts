import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-edittenant',
    templateUrl: './edittenant.component.html',
    styles: [
        `@media screen and (max-width: 768px) {
          .scroll{
            overflow-x: scroll !important;
          }
        }
      `
    ],
    providers: [
        [DatePipe]
    ]
})
export class EditTenantComponent implements OnInit, OnDestroy {
    tenantsubmitted = false;
    tenantForm: FormGroup;
    firstname: string;
    lastname: string;
    siteId: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    mobilenumber: string;
    email: string;
    parkingbayId: any;
    password: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    code: string;
    Id: number;
    houseorflatno: string;
    bayconfigdiv = 'none';
    sites: any = [];
    bayconfigs: any = [];
    bayconfigobj: any = [];
    baynos: any = [];
    baynonew: number;
    baynonewobj: number;
    TenantId: any;
    vehiclesperbay: string;
    vehiclereg:any;
    parkingbayidobj: any;
    baynoobj: any = [];
    mindate = new Date();
    numbers: number[];
    filelists: any = [];
    file: File;
    arrayBuffer: any;
    filerecordsdiv = 'none';
    files: Array<any> = new Array<any>();
    fileToUpload1: File = null;
    fileToUpload2: File = null;
    residencyproofid: any;
    identityproofid: any;
    dateSelected = [];
    updateenddate: boolean;
    // modalRef: BsModalRef;
    // show:boolean

    constructor(private datePipe: DatePipe, private translate: TranslateService, private spinner: NgxSpinnerService, private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
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
        this.numbers = Array(261).fill(0, 0, 261).map((x, i) => i);

    }
    get r() { return this.tenantForm.controls; }

    ngOnInit() {
        this.agent = this.getBrowserName();

        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.GetSites();
        this.Edit(id, value);
        // this.show=false;
        debugger
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
// openModal(template: TemplateRef<any>, id) {
//     this.bayno = id;
//     this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
//   }

//   confirm(): void {
//     this.deleteTenant(parseInt(this.SiteId))
//     this.modalRef.hide();
//   }
//   deleteTenant(id) {
//     var element = document.getElementById("loading") as HTMLDivElement;


//     var objreq={
//       Agent:this.agent,
//       RegisterUserId:parseInt(localStorage.getItem("LoginId")),
//        RoleId:localStorage.getItem("RoleId"),
//       Operation:"deleting tanant details",
//       Function:"delete tenants"
//     }
//         this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
    
//         })
//     element.style.display = 'block';
//     this.authService.DeleteUser(id).subscribe((result: any) => {
//       var data = JSON.parse(result);
//       if (data.status == "200") {
//         element.style.display = 'none';
//         this.onSuccess("Tenant deleted successfully");
//         //this.notifications.success('Success', "Tenant deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       }
//       else {
//         element.style.display = 'none';
//         this.alert(result.message);
//        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
//       }
//     })
//   }

//   decline(): void {

//     this.modalRef.hide();
//   }
    BindBayNo() {
        debugger;
        if (this.siteId != null || this.siteId != undefined || this.siteId != "") {
            if (this.parkingbayId != "0") {
                var j = this.bayconfigs.length;
                if ((Number(this.parkingbayId)) >= (Number(this.parkingbayidobj))) {
                    // this.GetParkingBayNos(this.siteId)
                    var obj = this.parkingbayId - this.parkingbayidobj;
                    for (var i = 0; i < obj; i++) {
                        j++;
                        this.bayconfigs.push({
                            id: j,
                            bayid: '',
                            bayconfigid: 0,
                            status: '',
                            vehiclesperbay: this.vehiclesperbay,
                            startdate: '',
                            enddate: '',
                            vehiclereg:'',
                            baynos: []
                        })

                    }
                    this.parkingbayidobj = this.parkingbayId;
                    this.bayconfigdiv = 'block';
                    setTimeout(() => {
                        for (var j = 0; j < this.bayconfigs.length; j++) {
                            debugger;
                            this.baynonew = parseInt(this.bayconfigs[j].bayid);
                            if (this.bayconfigs[j].status != 0) {
                                (document.getElementById("txtbayno_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                            }
                            this.AvoidDuplicate(this.bayconfigs[j].bayid, this.bayconfigs[j].id)
                            // (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                        }
                    }, 1000);
                }
                else {
                    // var obj = (this.parkingbayidobj - this.parkingbayId);
                    // for (var i = 0; i < obj; i--) {
                    //     j--;
                    //     this.bayconfigs.splice({
                    //         id: j,
                    //         bayid: '',
                    //         bayconfigid: 0,
                    //         status: '',
                    //         vehiclesperbay: this.vehiclesperbay,
                    //         startdate: '',
                    //         enddate: '',
                    //         baynos: []
                    //     })
                    //     this.parkingbayidobj = this.parkingbayId;
                    //     this.bayconfigdiv = 'block';

                    // }
                    this.notifications.alert('Alert', "parking bay cannot be decreased", NotificationType.Alert, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
                }
            }
            else {


                this.notifications.alert('Alert', "parking bay cannot be decreased", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }
    }
    GetParkingBayNos(Id) {
        var element = document.getElementById("loading") as HTMLDivElement;
        //element.style.display = 'block';
        this.authService.GetParkingBayNo(Id, '', '').subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                element.style.display = 'none';
                this.baynos = finalresult.result;
            }
            //  element.style.display = 'none';
        });
    }

    BindBaynos(id) {
        debugger;
        let newid = id - 1;
        if (this.bayconfigs[newid].startdate == '' && this.bayconfigs[newid].enddate == '') {

        }
        else if (this.bayconfigs.length === this.bayconfigobj.length) {
            if (this.datePipe.transform(this.bayconfigs[newid].enddate, "yyyy-MM-dd") == this.datePipe.transform(this.bayconfigobj[newid].enddate, "yyyy-MM-dd")) {

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
                // this.AvoidDuplicate(this.bayconfigs[id].bayid, newid);
            }
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
            // this.AvoidDuplicate(this.bayconfigs[id].bayid, newid);
        }
        else {
            this.alert("site is required");
        }
    }

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

    AvoidDuplicate(Id, indexid) {
        debugger
        var element = document.getElementById("loading") as HTMLDivElement;
        //element.style.display = 'block';
        debugger;
        var bayno = '';
        var newid = indexid - 1;
        if (Id != "") {
            for (var i = 0; i < this.bayconfigs.length; i++) {
                if (this.bayconfigs[i].bayid == Id) {
                    bayno = this.bayconfigs[i].bayid;
                }
            }
            this.baynonew = parseInt(bayno);
            this.baynonewobj = parseInt(bayno);

            for (var i = 0; i < this.bayconfigs.length; i++) {
                if (this.bayconfigs[i].id != indexid) {
                    for (var j = 0; j < this.bayconfigs[newid].baynos.length; j++) {
                        if (this.bayconfigs[newid].baynos[j].id == bayno) {
                            var disable1 = (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement);
                            if (disable1 != null) {
                                (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[i].id + "") as HTMLInputElement).disabled = true;
                            }
                        }
                        else {
                            var disable2 = (document.getElementById("txtoptionbay_" + this.bayconfigs[newid].baynos[j].id + "" + this.bayconfigs[i].id + "") as HTMLInputElement);
                            if (disable2 != null) {
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
            element.style.display = 'none';
        }
        else {
            for (var i = 0; i < this.bayconfigs.length; i++) {


                for (var j = 0; j < this.bayconfigs[newid].baynos.length; j++) {
                    if (this.bayconfigs[i].bayid != "") {
                        var disable3 = (document.getElementById("txtoptionbay_" + this.bayconfigs[i].bayid + "" + this.bayconfigs[i].id + "") as HTMLInputElement);
                        if (disable3 != null) {
                            (document.getElementById("txtoptionbay_" + this.bayconfigs[i].bayid + "" + this.bayconfigs[i].id + "") as HTMLInputElement).disabled = true;
                        }
                    }
                }


            }
            element.style.display = 'none';
        }
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
    GetSites() {
        var element = document.getElementById("loading") as HTMLDivElement;
        // element.style.display = 'block';
        var SiteId = localStorage.getItem("SiteId");
        var RoleId = localStorage.getItem("RoleId");
        this.authService.GetSites(1, 0, 1, RoleId, SiteId).subscribe((result: any) => {
            debugger;
            //  var data = JSON.stringify(result);
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                element.style.display = 'none';
                if (RoleId == "1") {
                    for (var i = 0; i < finalresult.result.length; i++) {

                        if (finalresult.result[i].isActive == true) {
                            this.sites.push({

                                id: finalresult.result[i].id,
                                siteName: finalresult.result[i].siteName,
                                vehiclesperbay: finalresult.result[i].maxVehiclesPerBay
                            })
                        }

                    }
                } else {
                    this.sites = finalresult.result;
                }
            }
            element.style.display = 'none';

        });
    }
    GetParkingBayNoEdit(Id, UserId) {
        var element = document.getElementById("loading") as HTMLDivElement;
        // element.style.display = 'block';
        this.authService.GetParkingBayNoEdit(Id, parseInt(UserId)).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                element.style.display = 'none';
                this.baynos = finalresult.result;

            }
            element.style.display = 'none';
        });
    }
    Edit(id: any, value: any) {
        debugger
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        var baseurl=this.authService.baseUrl;
        if(baseurl=="http://localhost:53846/api/"){
          baseurl="http://localhost:53846/";
        }
        if(baseurl=="https://api.gopermit.co.uk/"){
            baseurl="https://api.gopermit.co.uk";
        }
        // var baseurl="https://api.gopermit.co.uk";
        // var localbaseurl="http://localhost:53846/";
        if (value == "view") {
            this.buttonDisabled=true;
            this.tenantForm.controls['rsiteId'].disable();
            this.tenantForm.controls['rfirstname'].disable();
            this.tenantForm.controls['rlastname'].disable();
            this.tenantForm.controls['rhouseorflatno'].disable();
            this.tenantForm.controls['raddress'].disable();
            this.tenantForm.controls['rcity'].disable();
            this.tenantForm.controls['rstate'].disable();
            this.tenantForm.controls['rzipcode'].disable();
            this.tenantForm.controls['rmobilenumber'].disable();
            this.tenantForm.controls['remail'].disable();
            this.tenantForm.controls['rparkingbayId'].disable();
            this.tenantForm.controls['Pprofile1'].disable();
            this.tenantForm.controls['Pprofile2'].disable();

            // (document.getElementById("txtfirstname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtlastname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsite") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtaddress") as HTMLInputElement).disabled = true;
            // (document.getElementById("txthouseorflatno") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcity") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtstate") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtzipcode") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtmobilenumber") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtparkingbay") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtfileupload1") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtfileupload2") as HTMLInputElement).disabled = true;
            // (document.getElementById("isupdateenddate") as HTMLButtonElement).disabled = true;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            this.buttonDisabled=false;
            this.tenantForm.controls['rsiteId'].enable();
            this.tenantForm.controls['rfirstname'].enable();
            this.tenantForm.controls['rlastname'].enable();
            this.tenantForm.controls['rhouseorflatno'].enable();
            this.tenantForm.controls['raddress'].enable();
            this.tenantForm.controls['rcity'].enable();
            this.tenantForm.controls['rstate'].enable();
            this.tenantForm.controls['rzipcode'].enable();
            this.tenantForm.controls['rmobilenumber'].enable();
            this.tenantForm.controls['remail'].enable();
            this.tenantForm.controls['rparkingbayId'].enable();
            this.tenantForm.controls['Pprofile1'].enable();
            this.tenantForm.controls['Pprofile2'].enable();

            // (document.getElementById("txtfirstname") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtlastname") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtsite") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtaddress") as HTMLInputElement).disabled = false;
            // (document.getElementById("txthouseorflatno") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtcity") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtstate") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtzipcode") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtmobilenumber") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtemail") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtparkingbay") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtfileupload1") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtfileupload2") as HTMLInputElement).disabled = false;
            // (document.getElementById("isupdateenddate") as HTMLButtonElement).disabled = false;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.TenantId = id;
        this.authService.GetTenantUserById(id).subscribe((result: any) => {
            debugger;
            
            var finalresult = JSON.parse(result);
            console.log(finalresult);
            if (finalresult.status == "200") {
                this.TenantId = finalresult.result.id;
                this.firstname = finalresult.result.firstName;
                this.lastname = finalresult.result.lastName;
                this.city = finalresult.result.city;
                this.state = finalresult.result.state;
                this.houseorflatno = finalresult.result.houseOrFlatNo;
                this.zipcode = finalresult.result.zipCode;
                this.mobilenumber = finalresult.result.mobileNumber;
                this.siteId = finalresult.result.siteId;
                this.address = finalresult.result.address;
                // this.mobilenumber = finalresult.result.mobileNumber;
                // this.active = finalresult.result.isActive;
                this.parkingbayId = finalresult.result.parkingBay;
                this.parkingbayidobj = finalresult.result.parkingBay;
                this.email = finalresult.result.email;
                this.updateenddate = finalresult.result.updateEnddate;
                this.residencyproofid=finalresult.result.residencyProofId;
                this.identityproofid=finalresult.result.identityProofId;
                if(this.residencyproofid!=null){
                    this.residencyproofid=baseurl+finalresult.result.residencyProofId;
                }
                else{
                    this.residencyproofid = finalresult.result.residencyProofId;
                }
                if(this.identityproofid!=null){
                    this.identityproofid=baseurl+finalresult.result.identityProofId;
                }
                else{
                    this.identityproofid = finalresult.result.identityProofId;
                }
                 
                if(this.residencyproofid==null){
                this.residencyproofid=baseurl+"/TenantResidencyFiles/dummy residency.png";
                }
                if(this.identityproofid==null){
                    this.identityproofid=baseurl+"/TenantIdentityProofFiles/dummy identityproof.png";
                    }
                    if (this.updateenddate == true) {

                        var check1 = document.getElementById("isupdateenddate") as HTMLInputElement;
                        check1.checked = true;
                    }
                    else {
                        var check1 = document.getElementById("isupdateenddate") as HTMLInputElement;
                        check1.checked = false;
                    }

                // this.GetParkingBayNoEdit(this.siteId, this.TenantId);
                for (var j = 0; j < this.sites.length; j++) {
                    if (this.siteId == this.sites[j].id) {
                        this.vehiclesperbay = this.sites[j].vehiclesperbay;
                    }

                }
                var remainparkingbay = parseInt(this.parkingbayId) - parseInt(finalresult.result.baysConfig.length);
                setTimeout(() => {
                    debugger;
                    var j = 0;
                    if (finalresult.result.baysConfig.length == 0) {
                        for (var i = 0; i < this.parkingbayId; i++) {
                            j++;
                            this.bayconfigs.push({
                                id: j,
                                bayid: '',
                                vehiclesperbay: this.vehiclesperbay,
                                startdate: '',
                                enddate: '',
                                vehiclereg:'',
                                baynos: []
                            })
                        }
                        this.bayconfigdiv = 'block';
                    } else {

                        for (var i = 0; i < finalresult.result.baysConfig.length; i++) {
                            var vehicleperbay = '';
                            //  this.bayconfigobj = finalresult.result.baysConfig;
                            this.bayconfigdiv = 'block';
                            j++;
                            if (finalresult.result.baysConfig[i].maxVehiclesPerBay == "0") {
                                vehicleperbay = this.vehiclesperbay;
                            }
                            else {
                                vehicleperbay = finalresult.result.baysConfig[i].maxVehiclesPerBay;
                                // this.vehiclesperbay=vehicleperbay;
                            }
                            if (finalresult.result.baysConfig[i].vehiclereg[i] != undefined ||
                            finalresult.result.baysConfig[i].vehiclereg[i] != null) {
                                vrm = finalresult.result.baysConfig[i].vehiclereg[i].vrm;
                            }
                            else {
                                var vrm = "";
                                
                                // this.vehiclesperbay=vehicleperbay;
                            }
                            debugger
                            this.bayconfigs.push({
                                id: j,
                                bayid: finalresult.result.baysConfig[i].bayid,
                                bayconfigid: finalresult.result.baysConfig[i].bayconfigid,
                                status: finalresult.result.baysConfig[i].status,
                                vehiclesperbay: vehicleperbay,
                                startdate: new Date(finalresult.result.baysConfig[i].startDate),
                                enddate: new Date(finalresult.result.baysConfig[i].endDate),
                                baynos: finalresult.result.baysConfig[i].baynos,
                                vehiclereg:vrm,
                                
                            });
                            debugger
                            this.bayconfigobj.push({
                                id: j,
                                bayid: finalresult.result.baysConfig[i].bayid,
                                bayconfigid: finalresult.result.baysConfig[i].bayconfigid,
                                status: finalresult.result.baysConfig[i].status,
                                vehiclesperbay: vehicleperbay,
                                startdate: new Date(finalresult.result.baysConfig[i].startDate),
                                enddate: new Date(finalresult.result.baysConfig[i].endDate),
                                baynos: finalresult.result.baysConfig[i].baynos[i].bayName,
                                vehiclereg:vrm,
                            });
                        }
                        if (remainparkingbay > 0) {
                            for (var i = 0; i < remainparkingbay; i++) {
                                j++;
                                this.bayconfigs.push({
                                    id: j,
                                    bayid: '',
                                    bayconfigid: '',
                                    status: '',
                                    vehiclesperbay: vehicleperbay,
                                    startdate: '',
                                    enddate: '',
                                    vehiclereg:'',
                                    baynos: []
                                });
                                this.bayconfigobj.push({
                                    id: j,
                                    bayid: '',
                                    bayconfigid: '',
                                    status: '',
                                    vehiclesperbay: vehicleperbay,
                                    startdate: '',
                                    enddate: '',
                                    vehiclereg:'',
                                    baynos: []
                                });
                            }
                        }
                    }

                }, 1000);
                setTimeout(() => {
                    if (finalresult.result.baysConfig.length != 0) {
                        for (var j = 0; j < this.bayconfigs.length; j++) {
                            debugger;
                            this.baynonew = parseInt(this.bayconfigs[j].bayid);
                            if (this.bayconfigs[j].status != 0) {
                                (document.getElementById("txtbayno_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                            }
                            if (value == "view") {
                                (document.getElementById("txtbayno_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                                (document.getElementById("txtvehiclesperbay_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                                (document.getElementById("txtstartdate_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                                (document.getElementById("txtenddate_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                                (document.getElementById("txtvehiclereg_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;

                            }
                            else {
                                (document.getElementById("txtbayno_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = false;
                                (document.getElementById("txtvehiclesperbay_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = false;
                                (document.getElementById("txtstartdate_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = false;
                                (document.getElementById("txtenddate_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = false;
                                (document.getElementById("txtvehiclereg_" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = false;
                            }
                            this.AvoidDuplicate(this.bayconfigs[j].bayid, this.bayconfigs[j].id)
                            // (document.getElementById("txtoptionbay_" + this.baynonew + "" + this.bayconfigs[j].id + "") as HTMLInputElement).disabled = true;
                        }
                    }
                }, 1000);
                setTimeout(() => {
                    for (var i = 0; i < this.bayconfigs.length; i++) {
                        // this.BindBaynos(this.bayconfigs[i].id);
                    }

                }, 1000);
                element.style.display = 'none';
            }
            else {
                this.alert(result.message);
                // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    spinnerload() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 1000);
    }

    ngAfterViewInit(): void {
        // this.spinnerload();
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

    UpdateTenant() {

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
            if (this.address == undefined || this.address == null || this.address == "") {
                document.getElementById("txtaddress").className = "invalid-color";
            }
            if (this.city == undefined || this.city == null || this.city == "") {
                document.getElementById("txtcity").className = "invalid-color";
            }
            if (this.houseorflatno == undefined || this.houseorflatno == null || this.houseorflatno == "") {
                document.getElementById("txthouseorflatno").className = "invalid-color";
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
        var bayconfigsobjnew = [];
        for (var i = 0; i < this.bayconfigs.length; i++) {

            if (this.bayconfigs[i].bayid == "") {
                //document.getElementById("txtbayno_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                //  element.style.display = 'none';
                //  return;
            }
            else {

                document.getElementById("txtbayno_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if (this.bayconfigs[i].vehiclesperbay == "") {
                // document.getElementById("txtvehiclesperbay_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                //  element.style.display = 'none';
                //return;
            }
            else {
                debugger;
                this.bayconfigs[i].vehiclesperbay = this.bayconfigs[i].vehiclesperbay.toString();
                document.getElementById("txtvehiclesperbay_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if (this.bayconfigs[i].startdate == "") {
                // document.getElementById("txtstartdate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                //  element.style.display = 'none';
                //  return;
            }
            else {
                var startdate = this.bayconfigs[i].startdate;
                this.bayconfigs[i].startdate = this.datePipe.transform(startdate, "yyyy-MM-dd");

                document.getElementById("txtstartdate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6";
            }
            if (this.bayconfigs[i].enddate == "") {
                // document.getElementById("txtenddate_" + this.bayconfigs[i].id + "").className = "form-control col-sm-6 invalid-color";
                //element.style.display = 'none';
                //  return;
            }
            else {
                var enddate = this.bayconfigs[i].enddate;
                this.bayconfigs[i].enddate = this.datePipe.transform(enddate, "yyyy-MM-dd");
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
                if (this.bayconfigs[i].bayconfigid == "") {
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
                    dates: this.dateSelected.toString()
                });

            }
 
        }
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
        debugger
        

        debugger;
        var data = {
            FirstName: this.firstname,
            LastName: this.lastname,
            SiteId: this.siteId.toString(),
            Address: this.address,
            City: this.city,
            State: this.state,
            HouseOrFlatNo: this.houseorflatno,
            Zipcode: this.zipcode,
            MobileNumber: this.mobilenumber,
            Email: this.email,
            ParkingBay: this.parkingbayId,
            Password: this.password,
            ParentId: this.Id,
            Id: parseInt(this.TenantId),
            IsupdateEnddate : _chk1,
            BayConfigs: bayconfigsobjnew

        }
        this.authService.UpdateTenantUser(data).subscribe((data: any) => {

            var result = JSON.parse(data);
            if (result.status == "200") {
                const formData: FormData = new FormData();
                if (this.fileToUpload1!=null) {
                    formData.append("fileupload1", this.fileToUpload1, this.fileToUpload1.name);
                }
                
                if (this.fileToUpload2!=null) {
                    formData.append("fileupload2", this.fileToUpload2, this.fileToUpload2.name);
                }
                var id= result.result.id;
                debugger
                 formData.append("Id",id);
                 this.authService.SaveTenantUseruploads(formData).subscribe((finalresult: any) => {
                    if (finalresult.status == "200") {
                        element.style.display = 'none';

                        var objreq = {
                            RegisterUserId: parseInt(localStorage.getItem("LoginId")),
                            RoleId: localStorage.getItem("RoleId"),
                            Function: "update tenant",
                            IP: "",
                            Agent: this.agent,
                            Operation: "update tanant details" + this.firstname + '' + this.lastname,
                            TenantId : parseInt(id)
                        }
                

                //  this.notifications.success('Success', "Tenant Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });
                this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
                    
                    this.onSuccess("Tenant Updated Successfully");
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
            this.errormsg(error.message)
            // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }

}
