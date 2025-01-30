import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService}from 'ngx-spinner';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-adddatasource',
    templateUrl: './adddatasource.component.html'
})
export class AddDatasourceComponent implements OnInit, OnDestroy {

    datasourcesubmitted = false;
    datasourceForm: FormGroup;
    datasourcename: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.datasourceForm = this.formBuilder.group({
            dname: ['', Validators.required]
        });

    }
    get r() { return this.datasourceForm.controls; }
    ngOnInit() {

    }
    canceladddatasource() {
        this.router.navigateByUrl('app/appconfig/datasource');
    }
    ngOnDestroy() {

    }
    SaveDataSource() {
        this.spinner.show();
        this.datasourcesubmitted = true;
        if (this.datasourceForm.invalid) {
            if (this.datasourcename == undefined || this.datasourcename == null || this.datasourcename == "") {
                document.getElementById("txtdatasourcename").className = "invalid-color";
            }
            this.spinner.hide();
            return;
        }
        var data = {
            Name: this.datasourcename,
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }

        this.authService.SaveDatasource(data).subscribe((data: any) => {
           
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Datasource added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/appconfig/datasource']);
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