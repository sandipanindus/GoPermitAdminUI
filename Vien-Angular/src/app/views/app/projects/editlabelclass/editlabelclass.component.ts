import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-editlabelclass',
    templateUrl: './editlabelclass.component.html'
})
export class EditLabelClassComponent implements OnInit, OnDestroy {
    projectId: string;
    projects: any = [];
    labelclasssubmitted = false;
    labelclassForm: FormGroup;
    classname: string;
    LabelclassId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner: NgxSpinnerService, private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.labelclassForm = this.formBuilder.group({
            dname: ['', Validators.required],
            dprojectId: ['', Validators.required]
        });

    }
    get r() { return this.labelclassForm.controls; }

    ngOnInit() {
        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.projectId = "";
        this.GetProjects();
        this.Edit(id, value);
    }
    canceladdlabelclass() {
        this.router.navigateByUrl('app/projects/labelclass');
    }
    ngOnDestroy() {

    }


    GetProjects() {
        var loginId = localStorage.getItem("LoginId");
        this.authService.GetProjects(loginId).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.projects = finalresult.result;

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    Edit(id: any, value: any) {
        if (value == "view") {
            (document.getElementById("txtclassname") as HTMLInputElement).disabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            (document.getElementById("txtclassname") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.LabelclassId = id;
        this.authService.GetLabelClassById(id).subscribe((result: any) => {
            debugger;
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.classname = finalresult.result.name;
                this.projectId = finalresult.result.projectId;
                if (this.projectId == "0" || this.projectId == undefined || this.projectId == null) {
                    this.projectId = "";
                }
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
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
    UpdateLabelClass() {
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
            ProjectId: parseInt(this.projectId),
            Name: this.classname,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id: parseInt(this.LabelclassId)
        }
        this.authService.UpdateLabelClass(data).subscribe((data: any) => {

            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Label class Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

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