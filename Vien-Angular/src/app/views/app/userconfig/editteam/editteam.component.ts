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
    selector: 'app-editteam',
    templateUrl: './editteam.component.html',
    styleUrls: ['./editteam.component.css']
})
export class EditTeamComponent implements OnInit {
    isdisabled = false;
    teamsubmitted = false;
    teamForm: FormGroup;
    teamname: string;
    teamcode: string;
    users: any = [];
    registerusers: any = [];
    usersmodel: any = [];
    TeamId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.teamForm = this.formBuilder.group({
            rteamname: ['', Validators.required],
            rteamcode: ['', Validators.required]
        });

    }
    get r() { return this.teamForm.controls; }

    ngOnInit() {
      //  this.spinner.show();
        this.getUsers();

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
    canceladdteam() {
        this.router.navigateByUrl('app/userconfig/team');
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
    Edit(id: any, value: any) {
        if (value == "view") {
            (document.getElementById("txtteamname") as HTMLInputElement).disabled = true;
            (document.getElementById("txtteamcode") as HTMLInputElement).disabled = true;
            this.isdisabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            (document.getElementById("txtteamname") as HTMLInputElement).disabled = false;
            (document.getElementById("txtteamcode") as HTMLInputElement).disabled = false;
            this.isdisabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.TeamId = id;
        this.authService.GetTeamsById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.teamcode = finalresult.result.code;
                this.teamname = finalresult.result.name;
                for (var i = 0; i < finalresult.result.users.length; i++) {
                    var chk2 = document.getElementById("CheckboxRU_" + finalresult.result.users[i].registerUserId) as HTMLInputElement;
                    if (chk2 != null)
                        chk2.checked = true
                }
                for (var i = 0; i < this.registerusers.length; i++) {
                    var chk2 = document.getElementById("CheckboxRU_" + this.registerusers[i].userId) as HTMLInputElement;
                    if (chk2.checked == true) {
                        this.registerusers[i].chkteam = true;
                    }
                }
                //this.spinner.hide();
            }
            else {
               // this.spinner.hide();
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }, (error) => {
            this.spinner.hide();
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });

    }
    getUsers() {
        var loginId = localStorage.getItem('LoginId');
        this.authService.GetRegisterUsers(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.registerusers = finalresult.result;
                var id = this.approute.snapshot.params['id'];
                var value = this.approute.snapshot.params['value'];
                setTimeout(() => {
                    this.Edit(id, value);
                }, 1000);
            }
            else {
                this.spinner.hide();
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    UpdateTeam() {
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
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id: parseInt(this.TeamId)
        }
        this.authService.UpdateTeam(data).subscribe((data: any) => {
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Team Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

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