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
    selector: 'app-addteam',
    templateUrl: './addteam.component.html',
    styleUrls: ['./addteam.component.css']
})
export class AddTeamComponent implements OnInit, OnDestroy {
    chkalluser = false;
    teamsubmitted = false;
    teamForm: FormGroup;
    teamname: string;
    teamcode: string;
    users: any = [];
    registerusers: any = [];
    usersmodel: any = [];
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.teamForm = this.formBuilder.group({
            rteamname: ['', Validators.required],
            rteamcode: ['', Validators.required]
        });

    }
    get r() { return this.teamForm.controls; }
    ngOnInit() {
        //this.spinner.show();
        this.GetRegisterUsers();
    }
    canceladdteam() {
        this.router.navigateByUrl('app/userconfig/team');
    }
    ngOnDestroy() {

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
    GetRegisterUsers() {
        var loginId = localStorage.getItem('LoginId');
        this.authService.GetRegisterUsers(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.registerusers = finalresult.result;
                // this.spinner.hide();
            }
            else {
                // this.spinner.hide();
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }, (error) => {
            // this.spinner.hide();
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }
    checkuser(Id) {
        var check = document.getElementById("CheckboxRU_" + Id) as HTMLInputElement;
        if (check.checked == true) {
            for (var i = 0; i < this.registerusers.length; i++) {
                if (Id == this.registerusers[i].userId) {
                    this.registerusers[i].chkteam = true;
                }
            }
        }
        else {
            for (var i = 0; i < this.registerusers.length; i++) {
                if (Id == this.registerusers[i].userId) {
                    this.registerusers[i].chkteam = false;
                }
            }
        }
    }
    chkall() {
        var check = document.getElementById("Checkboxall") as HTMLInputElement;
        if (check.checked == true) {
            for (var i = 0; i < this.registerusers.length; i++) {
                this.registerusers[i].chkteam = true;
            }
        }
        else {
            for (var i = 0; i < this.registerusers.length; i++) {
                this.registerusers[i].chkteam = false;
            }
        }
    }
    SaveTeam() {
        this.spinner.show();
        this.teamsubmitted = true;
        if (this.teamForm.invalid) {
            if (this.teamname == null || this.teamname == undefined || this.teamname == "") {
                document.getElementById("txtteamname").className = "invalid-color";
            }
            if (this.teamcode == null || this.teamcode == undefined || this.teamcode == "") {
                document.getElementById("txtteamcode").className = "invalid-color";
            }
            this.spinner.hide();
            return;
        }
        var data = {
            Name: this.teamname,
            Code: this.teamcode,
            Users: this.registerusers,
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }

        this.authService.SaveTeam(data).subscribe((data: any) => {
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success', "Team added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });
                this.spinner.hide();
                setTimeout(() => {
                    this.router.navigate(['app/userconfig/team']);
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