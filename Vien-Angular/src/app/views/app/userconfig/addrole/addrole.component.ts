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
    selector: 'app-addrole',
    templateUrl: './addrole.component.html'
})
export class AddRoleComponent implements OnInit, OnDestroy {

    rolesubmitted = false;
    roleForm: FormGroup;
    rolename: string;
    description: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner: NgxSpinnerService, private translate: TranslateService,
        private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.roleForm = this.formBuilder.group({
            rname: ['', Validators.required]
        });

    }
    get r() { return this.roleForm.controls; }
    ngOnInit() {

    }

    canceladdrole() {
        this.router.navigateByUrl('app/userconfig/role');
    }
    ngOnDestroy() {

    }
    onSuccess(msg) {
        this.notifications.create(this.translate.instant('Success'),
            this.translate.instant(msg), NotificationType.Success,
            { timeOut: 3000, showProgressBar: true });
    }
    error(msg) {
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
    SaveRole() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        this.rolesubmitted = true;
        if (this.roleForm.invalid) {
            if (this.rolename == null || this.rolename == undefined || this.rolename == "") {
                document.getElementById("txtrolename").className = "invalid-color";
            }
            element.style.display = 'none';
            return;
        }
        var data = {
            Name: this.rolename,
            Description: this.description,
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }

        this.authService.SaveRole(data).subscribe((data: any) => {
            var result = JSON.parse(data);
            if (result.status == "200") {
                element.style.display = 'none';
                this.onSuccess('Role saved successfully');

                setTimeout(() => {
                    this.router.navigate(['app/userconfig/role']);
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