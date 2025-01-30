import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-addsite',
    templateUrl: './addsite.component.html',
    styleUrls: ['./addsite.component.css']
})
export class AddSiteComponent implements OnInit, OnDestroy {
    active: boolean;
    sitesubmitted = false;
    sitecode: string;
    parkingbaydiv = 'none';
    seperatorId: string;
    section: any;
    siteForm: FormGroup;
    parkingbayForm: FormGroup;
    visitorbayForm: FormGroup;
    visitorbaydiv = 'none'
    parkingbaysubmitted = false;
    visitorbaysubmitted = false;
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
    vsection: any;
    vseperatorId: string;
    visitorparkingbay: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    bays: any = [];
    visitorbays: any = [];
    visitorsessions: any = [];
    total: number = 0;
    visitortotal: number = 0;
    vehiclesperbay: string;
    maxparkingsession: string;
    timeunit: string;
    constructor(private spinner: NgxSpinnerService, private translate: TranslateService, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.siteForm = this.formBuilder.group({
            rsitename: ['', Validators.required],
            rsitecode: ['', Validators.required],
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
            rvehiclesperbay: ['', Validators.required]
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

        this.agent = this.getBrowserName();
        this.seperatorId = '';
        this.vseperatorId = '';
        this.visitorsessions = [];
        var j = 0;
        for (var i = 0; i < 3; i++) {
            j++;
            this.visitorsessions.push({
                id: j,
                duration: '',
                sessionunit: ''
            })
        }
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
    error() {
        this.notifications.create(this.translate.instant('Error'), this.translate.instant('alert.notification-content'), NotificationType.Error, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false
        });
    }
    visitorgetcount() {
        debugger;
        var from = '';
        var to = '';
        var count = '';
        var total = '';
        //if (this.visitortotal != parseInt(this.visitorparkingbay)) {
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
        //      this.notifications.alert('Alert', "No of Total visitor Bay finished", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        //  }


    }
    getcount() {
        debugger;
        var tenantparkingbay = this.tenantparkingbay;
        var from = '';
        var to = '';
        var count = '';
        var total = '';
        // if (this.total != parseInt(this.tenantparkingbay)) {
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

        // }
        //  else {
        //    this.notifications.alert('Alert', "No of Total Bay finished", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        //    }


    }
    BindParkingBay() {
        debugger;
        this.bays = [];
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
    SaveSite() {
        debugger
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
        this.visitorbaysubmitted = true;
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
        debugger;
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
        var check = document.getElementById("userchkactive") as HTMLInputElement;
        if (check.checked == true) {
            this.active = true;
        }
        else {
            this.active = false;
        }
        var _chk1=false;
        var _chk2=false; 
        var _chk3=false;
        var check1 = document.getElementById("manageparkingactive") as HTMLInputElement;
        if (check1.checked == true) {
            _chk1 = true;
        }
        else {
            _chk1= false;
        }
        var check2 = document.getElementById("visitorparkingactive") as HTMLInputElement;
        if (check2.checked == true) {
            _chk2 = true;
        }
        else {
            _chk2= false;
        }
        var check3 = document.getElementById("zatparklogsactive") as HTMLInputElement;
        if (check3.checked == true) {
            _chk3 = true;
        }
        else {
            _chk3= false;
        }
        if (this.total < parseInt(this.tenantparkingbay)) {
            element.style.display = 'none';
            this.alert("fill the parking bay upto to parkingbayno");
            // this.notifications.alert('Alert', "fill the parking bay upto to parkingbayno", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            return;
        }
        if (this.total > parseInt(this.tenantparkingbay)) {
            element.style.display = 'none';
            this.alert("No of total bay not be exceeded");
            //this.notifications.alert('Alert', "No of total bay not be exceeded", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            return;
        }
        if (this.visitortotal < parseInt(this.visitorparkingbay)) {
            element.style.display = 'none';
            this.alert("fill the visitor bay upto to visitorbayno")
            //this.notifications.alert('Alert', "fill the visitor bay upto to visitorbayno", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            return;
        }
        if (this.visitortotal > parseInt(this.visitorparkingbay)) {
            element.style.display = 'none';
            this.alert("No of total visitor bay not be exceeded");
            // this.notifications.alert('Alert', "No of total visitor bay not be exceeded", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            return;
        }
        debugger;

        if ((document.getElementById("customRadio1") as HTMLInputElement).checked == true) {
            this.timeunit = "Minutes";
        }
        else if ((document.getElementById("customRadio2") as HTMLInputElement).checked == true) {
            this.timeunit = "Hours";
        }
        // else if((document.getElementById("customRadio3") as HTMLInputElement).checked==true){
        //     this.timeunit="Days";
        // }
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
                if (this.visitorsessions[i].sessionunit == "Minutes") {
                    if (this.visitorsessions[i].duration > "45") {
                        this.alert("not exceed greater than 45 minutes");
                        // this.notifications.alert('Alert', "not exceed greater than 45 minutes", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                        element.style.display = 'none';
                        return;
                    }
                }
                else if (this.visitorsessions[i].sessionunit == "Hours") {
                    // if (this.visitorsessions[i].duration > "2") {
                    //     this.alert("not exceed greater than 2 hours");
                    //     //this.notifications.alert('Alert', "not exceed greater than 2 hours", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                    //     element.style.display = 'none';
                    //     return;
                    // }
                }
                document.getElementById("txtsessionunit_" + this.visitorsessions[i].id + "").className = "form-control col-md-6";
            }
        }

        var objreq = {
            Agent: this.agent,
            RegisterUserId: parseInt(localStorage.getItem("LoginId")),
            RoleId: localStorage.getItem("RoleId"),
            Operation: "Adding the" + this.sitename,
            Function: "Adding site"
        }
        this.authService.Saveauditlog(objreq).subscribe((respone: any) => {

        })
        var data = {
            SiteName: this.sitename,
            SiteCode: this.sitecode,
            SiteAddress: this.siteaddress,
            City: this.city,
            State: this.state,
            Zipcode: this.zipcode,
            ContactPersonName: this.contactpersonname,
            Email: this.email,
            ContactNumber: this.contactnumber,
            MobileNumber: this.mobilenumber,
            Active: this.active,
            ManageParkingAvailble: _chk1,
            VisitorParkingAvailble: _chk2,
            Zatparklogs24hrs: _chk3,
            TenantParkingBays: this.tenantparkingbay,
            VisitorParkingBays: this.visitorparkingbay,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Section: this.section,
            Seperator: this.seperatorId,
            Total: this.total,
            ParkingBays: this.bays,
            VisitorBays: this.visitorbays,
            VSection: this.vsection,
            VSeperator: this.vseperatorId,
            VehiclesPerBay: parseInt(this.vehiclesperbay),
            MaxParkingSession: this.maxparkingsession,
            TimeUnit: this.timeunit,
            VisitorSessions: this.visitorsessions
        }
        debugger
        this.authService.SaveSite(data).subscribe((data: any) => {
            
            debugger
            var result = JSON.parse(data);
            if (result.status == "200") {
                element.style.display = 'none';
                this.onSuccess("Site saved successfully");

                setTimeout(() => {
                    this.router.navigateByUrl('app/siteconfig/site');
                }, 1000);

            }
            else {
                element.style.display = 'none';
                this.alert(result.message);
            }
        }, (error) => {
            element.style.display = 'none';
            this.errormsg(error.message);
        });
    }
}