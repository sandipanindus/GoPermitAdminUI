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
    selector: 'app-addlabelclass',
    templateUrl: './addlabelclass.component.html'
})
export class AddLabelClassComponent implements OnInit, OnDestroy {
    projects: any = [];
    projectId:string;
    labelclasssubmitted = false;
    labelclassForm: FormGroup;
    classname: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.labelclassForm = this.formBuilder.group({
            dname: ['', Validators.required],
            dprojectId: ['', Validators.required]
        });

    }
    get r() { return this.labelclassForm.controls; }
    ngOnInit() {
     
        this.GetProjects();
        this.projectId="";
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
    GetProjects(){
        var loginId = localStorage.getItem("LoginId");
        this.authService.GetProjects(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.projects = finalresult.result;

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    canceladdlabelclass() {
        this.router.navigateByUrl('app/projects/labelclass');
    }
    ngOnDestroy() {

    }
    SaveLabelClass() {
        this.spinner.show();
        this.labelclasssubmitted = true;
        if (this.labelclassForm.invalid) {
            if (this.classname == undefined || this.classname == null || this.classname == "") {
                document.getElementById("txtclassname").className = "invalid-color";
            }
            if (this.projects == undefined || this.projects == null || this.projectId == "") {
                document.getElementById("txtprojectId").className = "invalid-color";
            }
            this.spinner.hide();
            return;
        }
        var data = {
            Name: this.classname,
            ProjectId:parseInt(this.projectId),
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }

        this.authService.SaveLabelclass(data).subscribe((data: any) => {
           
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Label class added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/projects/labelclass']);
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