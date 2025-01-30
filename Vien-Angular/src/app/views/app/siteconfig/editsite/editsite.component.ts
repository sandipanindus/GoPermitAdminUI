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
    selector: 'app-editsite',
    templateUrl: './editsite.component.html',
    styleUrls: ['./editsite.component.css']
})
export class EditSiteComponent implements OnInit, OnDestroy {
    active: boolean;
    manageparkingavailable: boolean;
    visitorparkingavailable: boolean;
    zatparklogsavailable: boolean;

    sitesubmitted = false;
    parkingbaydiv = 'none';
    sitecode:string;
    seperatorId: string;
    section: any;
    siteForm: FormGroup;
    sitename: string;
    siteaddress: string;
    city: string;
    state: string;
    zipcode: string;
    contactpersonname: string;
    email: string;
    contactnumber: string;
    mobilenumber: string;
    tenantparkingbay: string;
    visitorparkingbay: string;
    SiteId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    bays: any = [];
    total: number = 0;
    total1: number;
    parkingbayForm: FormGroup;
    visitorbayForm: FormGroup;
    visitorbaydiv = 'none'
    parkingbaysubmitted = false;
    visitorbaysubmitted = false;
    vsection: any;
    vseperatorId: string;
    visitorbays: any = [];
    visitorsessions: any = [];
    visitortotal: number = 0;
    modalRef1: BsModalRef;
    modalRef2: BsModalRef;
    message: string;
    tenantedit: boolean = false;
    tenantbays: any = [];
    visitorbaysedit: any = [];
    visitoredit: boolean = false;
    vehiclesperbay: string;
    maxparkingsession: string;
    timeunit: string;
    constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.siteForm = this.formBuilder.group({
            rsitename: ['', Validators.required],
            rsitecode:['',Validators.required],
            rsiteaddress: ['', Validators.required],
            rcity: ['', Validators.required],
            rstate: ['', Validators.required],
            rzipcode: ['', Validators.required],
            rcontactpersonname: ['', Validators.required],
            remail: ['', [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
            rcontactnumber: ['', Validators.required],
            rmobilenumber: ['', Validators.required],
            rtenantparkingbay: ['', Validators.required],
            rvisitorparkingbay: ['', Validators.required],
            rvehiclesperbay: ['', Validators.required],
            rcustomRadio1:['']
        });
        this.parkingbayForm = this.formBuilder.group({

            psection: ['', [Validators.required, Validators.maxLength]],
            pseperatorId: ['', Validators.required],
        });
        this.visitorbayForm = this.formBuilder.group({

            vsection: ['', [Validators.required, Validators.maxLength]],
            vseperatorId: ['', Validators.required],
            vmaxparkingsession: ['', Validators.required]
        });

    }
    get r() { return this.siteForm.controls; }
    get p() { return this.parkingbayForm.controls; }
    get v() { return this.visitorbayForm.controls; }

    ngOnInit() {
        this.agent=this.getBrowserName();

        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.Edit(id, value);
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
    canceladdsite() {
        this.router.navigateByUrl('app/siteconfig/site');
    }
    ngOnDestroy() {

    }
    openTenantModal(template: TemplateRef<any>) {
        this.modalRef1 = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirmtenant(): void {
        this.tenantedit = true;

        this.parkingbayForm.controls['psection'].enable();
        this.parkingbayForm.controls['pseperatorId'].enable();
        this.siteForm.controls['rtenantparkingbay'].enable();
        
        // (document.getElementById("txtsection") as HTMLInputElement).disabled = false;
        // (document.getElementById("txttenantparkingbay") as HTMLInputElement).disabled = false;
        // (document.getElementById("txtseperator") as HTMLInputElement).disabled = false;
        for (var i = 0; i < this.bays.length; i++) {
            (document.getElementById("txtprefix_" + this.bays[i].id + "") as HTMLInputElement).disabled = false;
            (document.getElementById("txtfrom_" + this.bays[i].id + "") as HTMLInputElement).disabled = false;
            (document.getElementById("txtto_" + this.bays[i].id + "") as HTMLInputElement).disabled = false;
        }
        var element = document.getElementById("txttenantdiv") as HTMLDivElement;
        element.style.display = 'none';
        var element1 = document.getElementById("txttecanceldiv") as HTMLDivElement;
        element1.style.display = 'block';
        this.modalRef1.hide();
    }
    canceltenant() {
        var load = document.getElementById("loading") as HTMLDivElement;
        load.style.display = 'block';
        this.tenantedit = false;

        this.parkingbayForm.controls['psection'].disable();
        this.parkingbayForm.controls['pseperatorId'].disable();
        this.siteForm.controls['rtenantparkingbay'].disable();

        // (document.getElementById("txtsection") as HTMLInputElement).disabled = true;
        // (document.getElementById("txttenantparkingbay") as HTMLInputElement).disabled = true;
        // (document.getElementById("txtseperator") as HTMLInputElement).disabled = true;

        let j = 0;
        this.bays = [];
        this.total = 0;
        for (var i = 0; i < this.tenantbays.length; i++) {
            j++;
            this.total += parseInt(this.tenantbays[i].count);
            this.bays.push({
                id: j,
                prefix: this.tenantbays[i].prefix,
                from: this.tenantbays[i].from,
                to: this.tenantbays[i].to,
                count: this.tenantbays[i].count

            })

        }
        setTimeout(() => {
            for (var i = 0; i < this.bays.length; i++) {
                (document.getElementById("txtprefix_" + this.bays[i].id + "") as HTMLInputElement).disabled = true;
                (document.getElementById("txtfrom_" + this.bays[i].id + "") as HTMLInputElement).disabled = true;
                (document.getElementById("txtto_" + this.bays[i].id + "") as HTMLInputElement).disabled = true;
            }
        }, 1000);

        var element = document.getElementById("txttenantdiv") as HTMLDivElement;
        element.style.display = 'block';
        var element1 = document.getElementById("txttecanceldiv") as HTMLDivElement;
        element1.style.display = 'none';
        load.style.display = 'none';
    }
    cancelvisitor() {
        var load = document.getElementById("loading") as HTMLDivElement;
        load.style.display = 'block';
        this.visitoredit = false;

        this.visitorbayForm.controls['vsection'].disable();
        this.siteForm.controls['rvisitorparkingbay'].disable();
        this.visitorbayForm.controls['vseperatorId'].disable();
        this.visitorbayForm.controls['vmaxparkingsession'].disable();

        // (document.getElementById("txtvsection") as HTMLInputElement).disabled = true;
        // (document.getElementById("txtvisitorparkingbay") as HTMLInputElement).disabled = true;
        // (document.getElementById("txtvseperator") as HTMLInputElement).disabled = true;
        // (document.getElementById("txtmaxparkingsession") as HTMLInputElement).disabled = true;
        (document.getElementById("customRadio1") as HTMLInputElement).disabled = true;
        (document.getElementById("customRadio2") as HTMLInputElement).disabled = true;
        (document.getElementById("customRadio3") as HTMLInputElement).disabled = true;
        let j = 0;
        this.visitorbays = [];
        this.visitortotal = 0;
        for (var i = 0; i < this.visitorbaysedit.length; i++) {
            j++;
            this.visitortotal += parseInt(this.visitorbaysedit[i].count);
            this.visitorbays.push({
                id: j,
                prefix: this.visitorbaysedit[i].prefix,
                from: this.visitorbaysedit[i].from,
                to: this.visitorbaysedit[i].to,
                count: this.visitorbaysedit[i].count

            })

        }
        setTimeout(() => {
            for (var i = 0; i < this.visitorbays.length; i++) {
                (document.getElementById("txtvprefix_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = true;
                (document.getElementById("txtvfrom_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = true;
                (document.getElementById("txtvto_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = true;
            }
        }, 1000);

        var element = document.getElementById("txtvisitordiv") as HTMLDivElement;
        element.style.display = 'block';
        var element1 = document.getElementById("txtvicanceldiv") as HTMLDivElement;
        element1.style.display = 'none';
        load.style.display = 'none';
    }
    declinetenant(): void {

        this.modalRef1.hide();
    }
    openVisitorModal(template1: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template1, { class: 'modal-sm' });
    }

    confirmvisitor(): void {
        this.visitoredit = true;

        this.visitorbayForm.controls['vsection'].enable();
        this.siteForm.controls['rvisitorparkingbay'].enable();
        this.visitorbayForm.controls['vseperatorId'].enable();
        this.visitorbayForm.controls['vmaxparkingsession'].enable();

        // (document.getElementById("txtvsection") as HTMLInputElement).disabled = false;
        // (document.getElementById("txtvisitorparkingbay") as HTMLInputElement).disabled = false;
        // (document.getElementById("txtvseperator") as HTMLInputElement).disabled = false;
        // (document.getElementById("txtmaxparkingsession") as HTMLInputElement).disabled = false;
        (document.getElementById("customRadio1") as HTMLInputElement).disabled = false;
        (document.getElementById("customRadio2") as HTMLInputElement).disabled = false;
        for (var i = 0; i < this.visitorbays.length; i++) {
            (document.getElementById("txtvprefix_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = false;
            (document.getElementById("txtvfrom_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = false;
            (document.getElementById("txtvto_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = false;
        }

        for (var i = 0; i < this.visitorsessions.length; i++) {
            (document.getElementById("txtseduration_" + this.visitorsessions[i].id + "") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsessionunit_" + this.visitorsessions[i].id + "") as HTMLInputElement).disabled = false;
        }

        var element = document.getElementById("txtvisitordiv") as HTMLDivElement;
        element.style.display = 'none';
        var element1 = document.getElementById("txtvicanceldiv") as HTMLDivElement;
        element1.style.display = 'block';
        this.modalRef2.hide();
    }

    declinevisitor(): void {

        this.modalRef2.hide();
    }
    visitorgetcount() {
        debugger;
        var from = '';
        var to = '';
        var count = '';
        //  if (this.visitortotal != parseInt(this.visitorparkingbay)) {
        this.visitortotal = 0;
        for (var i = 0; i < this.visitorbays.length; i++) {
            if (this.visitorbays[i].from != "") {
                from = this.visitorbays[i].from;

            }
            if (this.visitorbays[i].to != "") {
                to = this.visitorbays[i].to;

            }
            if (this.visitorbays[i].from != "" && this.visitorbays[i].to != "") {
                if (parseInt(from) > parseInt(to)) {
                    count = ((parseInt(from) - parseInt(to)) + 1).toString();

                } else {
                    count = ((parseInt(to) - parseInt(from)) + 1).toString();
                }
                this.visitorbays[i].count = count;
            }
        }
        for (var j = 0; j < this.visitorbays.length; j++) {
            if (this.visitorbays[j].count != "") {
                let count = parseInt(this.visitorbays[j].count)
                this.visitortotal += count;
            }

        }

        //  }
        //  else {
        //       this.notifications.alert('Alert', "No of Total visitor Bay finished", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        //  }


    }
    getcount() {
        debugger;
        var from = '';
        var to = '';
        var count = '';
        //  if (this.total != parseInt(this.tenantparkingbay)) {
        this.total = 0;
        for (var i = 0; i < this.bays.length; i++) {
            if (this.bays[i].from != "") {
                from = this.bays[i].from;

            }
            if (this.bays[i].to != "") {
                to = this.bays[i].to;

            }
            if (this.bays[i].from != "" && this.bays[i].to != "") {
                if (parseInt(from) > parseInt(to)) {
                    count = ((parseInt(from) - parseInt(to)) + 1).toString();

                } else {
                    count = ((parseInt(to) - parseInt(from)) + 1).toString();
                }
                this.bays[i].count = count;
            }
        }
        for (var j = 0; j < this.bays.length; j++) {
            if (this.bays[j].count != "") {
                let count = parseInt(this.bays[j].count)
                this.total += count;
            }

        }

        //  }
        //  else {
        //      this.notifications.alert('Alert', "No of Total Bay finished", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        //   }


    }
    BindParkingBay() {
        debugger;
        this.bays = [];
        this.total = 0;
        var j = 0;
        if ((this.section != "" || this.section != undefined) && (this.tenantparkingbay != "" && this.tenantparkingbay != undefined)) {
            for (var i = 0; i < this.section; i++) {
                j = j + 1;
                this.bays.push({
                    id: j,
                    prefix: '',
                    from: '',
                    to: '',
                    count: '',
                })
            }
            if (this.section != undefined && this.section != "") {
                this.parkingbaydiv = "block";
            }
            else {
                this.parkingbaydiv = "none";
            }

        }
        else {
            this.parkingbaydiv = "none";
        }
    }
    BindVisitorBay() {
        debugger;
        this.visitortotal = 0;
        this.visitorbays = [];
        var j = 0;
        if ((this.vsection != "" || this.vsection != undefined) && (this.visitorparkingbay != "" && this.visitorparkingbay != undefined)) {
            for (var i = 0; i < this.vsection; i++) {
                j = j + 1;
                this.visitorbays.push({
                    id: j,
                    prefix: '',
                    from: '',
                    to: '',
                    count: '',
                })
            }
            if (this.vsection != undefined && this.vsection != "") {
                this.visitorbaydiv = "block";
            }
            else {
                this.visitorbaydiv = "none";
            }

        }
        else {
            this.visitorbaydiv = "none";
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
    Edit(id: any, value: any) {
        if (value == "view") {

            this.buttonDisabled=true;
            this.siteForm.controls['rsitename'].disable();
            this.siteForm.controls['rsitecode'].disable();
            this.siteForm.controls['rsiteaddress'].disable();
            this.siteForm.controls['rcity'].disable();
            this.siteForm.controls['rstate'].disable();
            this.siteForm.controls['rzipcode'].disable();
            this.siteForm.controls['rcontactpersonname'].disable();
            this.siteForm.controls['remail'].disable();
            this.siteForm.controls['rcontactnumber'].disable();
            this.siteForm.controls['rmobilenumber'].disable();
            this.siteForm.controls['rtenantparkingbay'].disable();
            this.siteForm.controls['rvisitorparkingbay'].disable();
            this.siteForm.controls['rvehiclesperbay'].disable();
            this.parkingbayForm.controls['psection'].disable();
            this.parkingbayForm.controls['pseperatorId'].disable();
            this.visitorbayForm.controls['vsection'].disable();
            this.visitorbayForm.controls['vseperatorId'].disable();
            this.visitorbayForm.controls['vmaxparkingsession'].disable();
           

            // (document.getElementById("txtsitename") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsitecode") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsiteaddress") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcity") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtstate") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtzipcode") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcontactpersonname") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtcontactnumber") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtmobilenumber") as HTMLInputElement).disabled = true;
            // (document.getElementById("userchkactive") as HTMLInputElement).disabled = true;
            // (document.getElementById("manageparkingactive") as HTMLInputElement).disabled = true;
            // (document.getElementById("visitorparkingactive") as HTMLInputElement).disabled = true;
            // (document.getElementById("txttenantparkingbay") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtvisitorparkingbay") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsection") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtseperator") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtvsection") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtvseperator") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
            // (document.getElementById("txtvisitoredit") as HTMLButtonElement).disabled = true;
            // (document.getElementById("txttenantedit") as HTMLButtonElement).disabled = true;
            // (document.getElementById("txtvehiclesperbay") as HTMLButtonElement).disabled = true;
            // (document.getElementById("txtmaxparkingsession") as HTMLInputElement).disabled = true;
            // (document.getElementById("customRadio1") as HTMLInputElement).disabled = true;
            // (document.getElementById("customRadio2") as HTMLInputElement).disabled = true;

        }
        else {

            this.buttonDisabled=false;
            this.siteForm.controls['rsitename'].enable();
            this.siteForm.controls['rsitecode'].enable();
            this.siteForm.controls['rsiteaddress'].enable();
            this.siteForm.controls['rcity'].enable();
            this.siteForm.controls['rstate'].enable();
            this.siteForm.controls['rzipcode'].enable();
            this.siteForm.controls['rcontactpersonname'].enable();
            this.siteForm.controls['remail'].enable();
            this.siteForm.controls['rcontactnumber'].enable();
            this.siteForm.controls['rmobilenumber'].enable();
            this.siteForm.controls['rtenantparkingbay'].disable();
            this.siteForm.controls['rvisitorparkingbay'].disable();
            this.siteForm.controls['rvehiclesperbay'].enable();
            this.parkingbayForm.controls['psection'].disable();
            this.parkingbayForm.controls['pseperatorId'].disable();
            this.visitorbayForm.controls['vsection'].disable();
            this.visitorbayForm.controls['vseperatorId'].disable();
            this.visitorbayForm.controls['vmaxparkingsession'].enable();

            // (document.getElementById("txtsitename") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtsitecode") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtsiteaddress") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtcity") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtstate") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtzipcode") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtcontactpersonname") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtemail") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtcontactnumber") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtmobilenumber") as HTMLInputElement).disabled = false;
            // (document.getElementById("userchkactive") as HTMLInputElement).disabled = false;
            // (document.getElementById("manageparkingactive") as HTMLInputElement).disabled = false;
            // (document.getElementById("visitorparkingactive") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtsection") as HTMLInputElement).disabled = true;
            // (document.getElementById("txttenantparkingbay") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtvisitorparkingbay") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtseperator") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtvsection") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtvseperator") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
            // (document.getElementById("txtvisitoredit") as HTMLButtonElement).disabled = false;
            // (document.getElementById("txttenantedit") as HTMLButtonElement).disabled = false;
            // (document.getElementById("txtvehiclesperbay") as HTMLButtonElement).disabled = false;
            // (document.getElementById("txtmaxparkingsession") as HTMLInputElement).disabled = false;
            // (document.getElementById("customRadio1") as HTMLInputElement).disabled = true;
            // (document.getElementById("customRadio2") as HTMLInputElement).disabled = true;

        }
        this.SiteId = id;
        this.authService.GetSiteById(id).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            console.log("editdata",result);
            if (finalresult.status == "200") {
                this.sitename = finalresult.result.siteName;
                this.sitecode=finalresult.result.siteCode;
                this.siteaddress = finalresult.result.siteAddress;
                this.city = finalresult.result.city;
                this.state = finalresult.result.state;
                this.zipcode = finalresult.result.zipcode;
                this.contactpersonname = finalresult.result.contactPersonName;
                this.email = finalresult.result.email;
                this.contactnumber = finalresult.result.contactNumber;
                this.mobilenumber = finalresult.result.mobileNumber;
                this.active = finalresult.result.isActive;
                this.manageparkingavailable = finalresult.result.manageParkingAvailble;
                this.visitorparkingavailable = finalresult.result.visitorParkingAvailble;
                this.zatparklogsavailable= finalresult.result.zatparklogs24hrs;
                this.tenantparkingbay = finalresult.result.tenantParkingBays;
                this.visitorparkingbay = finalresult.result.visitorParkingBays;
                this.SiteId = finalresult.result.id;
                this.section = finalresult.result.sectionsOrFloors;
                this.seperatorId = finalresult.result.seperator
                this.vsection = finalresult.result.visitorSectionsOrFloors;
                this.vseperatorId = finalresult.result.visitorSeperator;
                this.vehiclesperbay = finalresult.result.maxVehiclesPerBay;
                this.parkingbaydiv = 'block';
                this.visitorbaydiv = 'block';
                this.maxparkingsession = finalresult.result.visitorbays[0].maxParkingSession;
                this.timeunit = finalresult.result.visitorbays[0].timeUnit;
                if (this.timeunit == "Minutes") {
                    (document.getElementById("customRadio1") as HTMLInputElement).checked = true;
                }
                else if (this.timeunit == "Hours") {
                    (document.getElementById("customRadio2") as HTMLInputElement).checked = true;
                }
                else if (this.timeunit == "Days") {
                    (document.getElementById("customRadio3") as HTMLInputElement).checked = true;
                }
                if (finalresult.result.isActive == true) {
                    var check = document.getElementById("userchkactive") as HTMLInputElement;
                    check.checked = true;
                }
                else {
                    var check = document.getElementById("userchkactive") as HTMLInputElement;
                    check.checked = false;
                }
                if (finalresult.result.manageParkingAvailble == true) {
                    var check1 = document.getElementById("manageparkingactive") as HTMLInputElement;
                    check1.checked = true;
                }
                else {
                    var check1 = document.getElementById("manageparkingactive") as HTMLInputElement;
                    check1.checked = false;
                }
                if (finalresult.result.visitorParkingAvailble == true) {
                    var check2 = document.getElementById("visitorparkingactive") as HTMLInputElement;
                    check2.checked = true;
                }
                else {
                    var check2 = document.getElementById("visitorparkingactive") as HTMLInputElement;
                    check2.checked = false;
                }
                if (finalresult.result.zatparklogs24hrs == true) {
                    var check2 = document.getElementById("zatparklogsactive") as HTMLInputElement;
                    check2.checked = true;
                }
                else {
                    var check2 = document.getElementById("zatparklogsactive") as HTMLInputElement;
                    check2.checked = false;
                }
                let j = 0;
                this.tenantbays = finalresult.result.bays;
                for (var i = 0; i < finalresult.result.bays.length; i++) {
                    j++;
                    this.total += parseInt(finalresult.result.bays[i].count);
                    this.bays.push({
                        id: j,
                        prefix: finalresult.result.bays[i].prefix,
                        from: finalresult.result.bays[i].from,
                        to: finalresult.result.bays[i].to,
                        count: finalresult.result.bays[i].count

                    })

                }
                setTimeout(() => {
                    for (var i = 0; i < this.bays.length; i++) {
                        // this.parkingbayForm.controls['rtxtprefix_'+ this.bays[i].id + ''].disable();
                         (document.getElementById("txtprefix_" + this.bays[i].id + "") as HTMLInputElement).disabled = true;
                        (document.getElementById("txtfrom_" + this.bays[i].id + "") as HTMLInputElement).disabled = true;
                        (document.getElementById("txtto_" + this.bays[i].id + "") as HTMLInputElement).disabled = true;
                    }
                }, 1000);
                j = 0;
                this.visitorbaysedit = finalresult.result.visitorbays;
                for (var i = 0; i < finalresult.result.visitorbays.length; i++) {
                    j++;
                    this.visitortotal += parseInt(finalresult.result.visitorbays[i].count);
                    this.visitorbays.push({
                        id: j,
                        prefix: finalresult.result.visitorbays[i].prefix,
                        from: finalresult.result.visitorbays[i].from,
                        to: finalresult.result.visitorbays[i].to,
                        count: finalresult.result.visitorbays[i].count

                    })

                }
                setTimeout(() => {
                    for (var i = 0; i < this.visitorbays.length; i++) {
                        (document.getElementById("txtvprefix_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = true;
                        (document.getElementById("txtvfrom_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = true;
                        (document.getElementById("txtvto_" + this.visitorbays[i].id + "") as HTMLInputElement).disabled = true;
                    }
                }, 1000);

                for (var i = 0; i < finalresult.result.visitorsessions.length; i++) {

                    this.visitorsessions.push({
                        id: finalresult.result.visitorsessions[i].id,
                        duration: finalresult.result.visitorsessions[i].duration,
                        sessionunit: finalresult.result.visitorsessions[i].sessionUnit
                    })

                }
                setTimeout(() => {
                    for (var i = 0; i < this.visitorsessions.length; i++) {
                        // if (value == "view") {
                        (document.getElementById("txtseduration_" + this.visitorsessions[i].id + "") as HTMLInputElement).disabled = true;
                        (document.getElementById("txtsessionunit_" + this.visitorsessions[i].id + "") as HTMLInputElement).disabled = true;
                        // }
                        //  else{
                        //  (document.getElementById("txtseduration_" + this.visitorsessions[i].id + "") as HTMLInputElement).disabled = false;
                        //  (document.getElementById("txtsessionunit_" + this.visitorsessions[i].id + "") as HTMLInputElement).disabled = false;
                        // }
                    }
                }, 1000);
            }
            else {
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
    UpdateSite() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        this.sitesubmitted = true;
        debugger;
        if (this.siteForm.invalid) {
            if (this.sitename == undefined || this.sitename == null || this.sitename == "") {
                document.getElementById("txtsitename").className = "form-control invalid-color";
            }
            if (this.sitecode == undefined || this.sitecode == null || this.sitecode == "") {
                document.getElementById("txtsitecode").className = "form-control invalid-color";
            }
            if (this.siteaddress == undefined || this.siteaddress == null || this.siteaddress == "") {
                document.getElementById("txtsiteaddress").className = "form-control invalid-color";
            }
            if (this.city == undefined || this.city == null || this.city == "") {
                document.getElementById("txtcity").className = "form-control invalid-color";
            }
            if (this.state == undefined || this.state == null || this.state == "") {
                document.getElementById("txtstate").className = "form-control invalid-color";
            }
            if (this.zipcode == undefined || this.zipcode == null || this.zipcode == "") {
                document.getElementById("txtzipcode").className = "form-control invalid-color";
            }
            if (this.contactpersonname == undefined || this.contactpersonname == null || this.contactpersonname == "") {
                document.getElementById("txtcontactpersonname").className = "form-control invalid-color";
            }
            if (this.email == undefined || this.email == null || this.email == "") {
                document.getElementById("txtemail").className = "form-control invalid-color";
            }
            if (this.contactnumber == undefined || this.contactnumber == null || this.contactnumber == "") {
                document.getElementById("txtcontactnumber").className = "form-control invalid-color";
            }
            if (this.mobilenumber == undefined || this.mobilenumber == null || this.mobilenumber == "") {
                document.getElementById("txtmobilenumber").className = "form-control invalid-color";
            }
            if (this.tenantparkingbay == undefined || this.tenantparkingbay == null || this.tenantparkingbay == "") {
                document.getElementById("txttenantparkingbay").className = "form-control invalid-color";
            }
            if (this.visitorparkingbay == undefined || this.visitorparkingbay == null || this.visitorparkingbay == "") {
                document.getElementById("txtvisitorparkingbay").className = "form-control invalid-color";
            }
            if (this.tenantparkingbay == undefined || this.tenantparkingbay == null || this.tenantparkingbay == "") {
                document.getElementById("txttenantparkingbay").className = "form-control invalid-color";
            }
            if (this.vehiclesperbay == undefined || this.vehiclesperbay == null || this.vehiclesperbay == "") {
                document.getElementById("txtvehiclesperbay").className = "form-control invalid-color";
            }

            element.style.display = 'none';
            return;
        }
        this.parkingbaysubmitted = true;
        if (this.tenantedit == true) {
            if (this.parkingbayForm.invalid) {
                if (this.section == undefined || this.section == null || this.section == "") {
                    document.getElementById("txtsection").className = "form-control invalid-color";
                }
                if (this.seperatorId == undefined || this.seperatorId == null || this.seperatorId == "") {
                    document.getElementById("txtseperator").className = "form-control invalid-color";
                }
                element.style.display = 'none';
                return;
            }
        }
        this.visitorbaysubmitted = true;
        if (this.visitoredit == true) {
            if (this.visitorbayForm.invalid) {
                if (this.vsection == undefined || this.vsection == null || this.vsection == "") {
                    document.getElementById("txtvsection").className = "form-control invalid-color";
                }
                if (this.vseperatorId == undefined || this.vseperatorId == null || this.vseperatorId == "") {
                    document.getElementById("txtvseperator").className = "form-control invalid-color";
                }
                if (this.maxparkingsession == undefined || this.maxparkingsession == null || this.maxparkingsession == "") {
                    document.getElementById("txtmaxparkingsession").className = "form-control invalid-color";
                }
                element.style.display = 'none';
                return;
            }
        }
        debugger;
        if (this.tenantedit == true) {
            if (this.section != "" && this.section != undefined) {
                for (var i = 0; i < this.bays.length; i++) {

                    if (this.bays[i].from == '') {
                        document.getElementById("txtfrom_" + this.bays[i].id + "").className = "form-control invalid-color";
                        element.style.display = 'none';
                        return;
                    }
                    else {
                        document.getElementById("txtfrom_" + this.bays[i].id + "").className = "form-control";
                    }
                    if (this.bays[i].to == '') {
                        document.getElementById("txtto_" + this.bays[i].id + "").className = "form-control invalid-color";
                        element.style.display = 'none';
                        return;
                    }
                    else {
                        document.getElementById("txtto_" + this.bays[i].id + "").className = "form-control";
                    }
                }
            }
        }
        if (this.visitoredit == true) {
            if (this.vsection != "" && this.vsection != undefined) {
                for (var i = 0; i < this.visitorbays.length; i++) {

                    if (this.visitorbays[i].from == '') {
                        document.getElementById("txtvfrom_" + this.visitorbays[i].id + "").className = "form-control invalid-color";
                        element.style.display = 'none';
                        return;
                    }
                    else {
                        document.getElementById("txtvfrom_" + this.visitorbays[i].id + "").className = "form-control";
                    }
                    if (this.visitorbays[i].to == '') {
                        document.getElementById("txtvto_" + this.visitorbays[i].id + "").className = "form-control invalid-color";
                        element.style.display = 'none';
                        return;
                    }
                    else {
                        document.getElementById("txtvto_" + this.visitorbays[i].id + "").className = "form-control";
                    }
                }
            }
        }

        if (this.tenantedit == true) {
            if (this.total < parseInt(this.tenantparkingbay)) {
                element.style.display = 'none';
                this.alert("fill the parking bay upto to parkingbayno");
                // this.notifications.alert('Alert', "fill the parking bay upto to parkingbayno", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                return;
            }
            if (this.total > parseInt(this.tenantparkingbay)) {
                element.style.display = 'none';
                this.alert("No of total bay not be exceeded");
                // this.notifications.alert('Alert', "No of total bay not be exceeded", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                return;
            }
        }
        if (this.visitoredit == true) {
            if (this.visitortotal < parseInt(this.visitorparkingbay)) {
                element.style.display = 'none';
                this.alert("fill the visitor bay upto to visitorbayno")
                // this.notifications.alert('Alert', "fill the visitor bay upto to visitorbayno", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                return;
            }
            if (this.visitortotal > parseInt(this.visitorparkingbay)) {
                element.style.display = 'none';
                this.alert("No of total visitor bay not be exceeded")
                // this.notifications.alert('Alert', "No of total visitor bay not be exceeded", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                return;
            }
        }
        debugger;
        var check = document.getElementById("userchkactive") as HTMLInputElement;
        if (check.checked == true) {
            this.active = true;
        }
        else {
            this.active = false;
        }
        var check1 = document.getElementById("manageparkingactive") as HTMLInputElement;
        if (check1.checked == true) {
            this.manageparkingavailable = true;
        }
        else {
            this.manageparkingavailable = false;
        }var check2 = document.getElementById("visitorparkingactive") as HTMLInputElement;
        if (check2.checked == true) {
            this.visitorparkingavailable = true;
        }
        else {
            this.visitorparkingavailable = false;
        }
        var check3 = document.getElementById("zatparklogsactive") as HTMLInputElement;
        if (check3.checked == true) {
            this.zatparklogsavailable = true;
        }
        else {
            this.zatparklogsavailable = false;
        }
        if (this.tenantedit == false) {
            this.bays = [];
        }
        if (this.visitoredit == false) {
            this.visitorbays = [];
        }
        if ((document.getElementById("customRadio1") as HTMLInputElement).checked == true) {
            this.timeunit = "Minutes";
        }
        else if ((document.getElementById("customRadio2") as HTMLInputElement).checked == true) {
            this.timeunit = "Hours";
        }
        else if ((document.getElementById("customRadio3") as HTMLInputElement).checked == true) {
            this.timeunit = "Days";
        }
        for (var i = 0; i < this.visitorsessions.length; i++) {

            if (this.visitorsessions[i].duration == '') {
                document.getElementById("txtseduration_" + this.visitorsessions[i].id + "").className = "form-control invalid-color col-md-6";
                element.style.display = 'none';
                return;
            }
            else {
                document.getElementById("txtseduration_" + this.visitorsessions[i].id + "").className = "form-control col-md-6";
            }
            if (this.visitorsessions[i].sessionunit == '') {
                document.getElementById("txtsessionunit_" + this.visitorsessions[i].id + "").className = "form-control invalid-color col-md-6";
                element.style.display = 'none';
                return;
            }
            else {
                document.getElementById("txtsessionunit_" + this.visitorsessions[i].id + "").className = "form-control col-md-6";
            }
        }


        
    var objreq={
        Agent:this.agent,
        RegisterUserId:parseInt(localStorage.getItem("LoginId")),
        RoleId:localStorage.getItem("RoleId"),
        Operation:"updating site"+this.sitename,
        Function:"updating site"
      }
          this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
      
          })
        var data = {
            Id: this.SiteId,
            SiteName: this.sitename,
            SiteCode:this.sitecode,
            SiteAddress: this.siteaddress,
            City: this.city,
            State: this.state,
            Zipcode: this.zipcode,
            ContactPersonName: this.contactpersonname,
            Email: this.email,
            ContactNumber: this.contactnumber,
            MobileNumber: this.mobilenumber,
            Active: this.active,
            ManageParkingAvailble:this.manageparkingavailable,
            VisitorParkingAvailble:this.visitorparkingavailable,
            Zatparklogs24hrs:this.zatparklogsavailable,
            TenantParkingBays: this.tenantparkingbay,
            VisitorParkingBays: this.visitorparkingbay,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Section: this.section.toString(),
            Seperator: this.seperatorId,
            Total: this.total,
            ParkingBays: this.bays,
            VisitorBays: this.visitorbays,
            VSection: this.vsection.toString(),
            VSeperator: this.vseperatorId,
            VehiclesPerBay: parseInt(this.vehiclesperbay),
            MaxParkingSession: this.maxparkingsession,
            TimeUnit: this.timeunit,
            VisitorSessions: this.visitorsessions
        }


        this.authService.UpdateSite(data).subscribe((data: any) => {

            var result = JSON.parse(data);
            if (result.status == "200") {
                element.style.display = 'none';
                this.onSuccess("Site Updated Successfully");
                //  this.notifications.success('Success', "Site Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigateByUrl('app/siteconfig/site');
                }, 1000);
            }
            else {
                element.style.display = 'none';
                this.alert(result.message);
                // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }, (error) => {
            element.style.display = 'none';
            this.errormsg(error.message);
            //this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }

}