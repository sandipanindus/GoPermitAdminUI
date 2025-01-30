import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-adddatatype',
    templateUrl: './adddatatype.component.html'
})
export class AddDatatypeComponent implements OnInit, OnDestroy {

    datatypesubmitted = false;
    datatypeForm: FormGroup;
    datatypename: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.datatypeForm = this.formBuilder.group({
            dname: ['', Validators.required]
        });

    }
    get r() { return this.datatypeForm.controls; }
    ngOnInit() {

    }
    canceladddatatype() {
        this.router.navigateByUrl('app/appconfig/datatype');
    }
    ngOnDestroy() {

    }
    SaveDataType() {
        this.spinner.show();
        this.datatypesubmitted = true;
        if (this.datatypeForm.invalid) {
            if (this.datatypename == "" || this.datatypename == undefined || this.datatypename == null) {
                document.getElementById("txtdatatypename").className = "invalid-color";
            }
            this.spinner.hide();
            return;
        }
        var data = {
            Name: this.datatypename,
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }

        this.authService.SaveDatatype(data).subscribe((data: any) => {
          
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Datatype added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/appconfig/datatype']);
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