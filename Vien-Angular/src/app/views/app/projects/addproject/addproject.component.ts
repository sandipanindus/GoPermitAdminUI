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
    selector: 'app-addproject',
    templateUrl: './addproject.component.html',
    styleUrls: ['./addproject.component.css']
})
export class AddProjectComponent implements OnInit, OnDestroy {
    datatypemodel: any = [];
    statuses: any = [];
    statusId:string;
    annotationmodel: any = [];
    datatypeId: number;
    projectsubmitted = false;
    projectForm: FormGroup;
    projectname: string;
    projectcode: string;
    annotationdiv = 'none'
    datasources: any = [];
    datatypes: any = [];
    teams: any = [];
    datasourceId: number;
    annotationtypes: any = [];
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    teamId:string;
    constructor(private spinner:NgxSpinnerService,private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.projectForm = this.formBuilder.group({
            rprojectname: ['', Validators.required],
            rprojectcode: ['', Validators.required],
            rstatusId:['',Validators.required],
            rteamId:['',Validators.required]
        });

    }
    get r() { return this.projectForm.controls; }
    ngOnInit() {
        this.statuses=[
            {
                id:"1",
                name:"New"
            },{
                id:"2",
                name:"In Progress"
            },{
                id:"3",
                name:"Complete"
            }
        ]
        this.statusId="";
        this.teamId="";
        this.GetDataSources();
        this.GetDataTypes();
        this.GetTeams();
    }
    canceladdproject() {
        this.router.navigateByUrl('app/projects/project');
    }
    ngOnDestroy() {

    }
    GetTeams(){
        var loginId = localStorage.getItem("LoginId");
        this.authService.GetTeams(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.teams = finalresult.result;

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    GetDataTypes(){
        var loginId = localStorage.getItem("LoginId");
        this.authService.GetDataTypes(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.datatypes = finalresult.result;

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    GetDataSources(){
        var loginId = localStorage.getItem("LoginId");
        this.authService.GetDataSources(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.datasources = finalresult.result;

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
        }, 2000);
    }

    ngAfterViewInit(): void {
        this.spinnerload();
    }
    BindAnnotationTypes(Id) {
        var loginId = localStorage.getItem("LoginId");
        var check = document.getElementById("chk_" + Id) as HTMLInputElement;

        if (check.checked == true) {
            this.authService.GetAnnotationByDataTypeId(loginId, Id).subscribe((result: any) => {
                var finalresult = JSON.parse(result);
                if (finalresult.status == "200") {
                    this.annotationtypes = finalresult.result;
                    if (this.annotationtypes.length > 0) {
                        this.annotationdiv = 'flex';
                    }
                    else {
                        this.annotationdiv = 'none';
                        this.notifications.alert('Alert', "No annotation types for that datatype", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                    }
                }
                else {
                    this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
                }
            });
        }
        else {
            this.annotationdiv = 'none';
        }
    }
    SaveProject() {
        this.spinner.show();
        this.projectsubmitted = true;
        this.annotationmodel=[];
        if (this.projectForm.invalid) {
            if (this.projectname == null || this.projectname == undefined || this.projectname == "") {
                document.getElementById("txtprojectname").className = "invalid-color";
            }
            if (this.projectcode == null || this.projectcode == undefined || this.projectcode == "") {
                document.getElementById("txtprojectcode").className = "invalid-color";
            }
            if(this.statusId==null || this.statusId==undefined || this.statusId==""){
                document.getElementById("txtstatusId").className="invalid-color";
            }
            if(this.teamId==null || this.teamId==undefined || this.teamId==""){
                document.getElementById("txtteamId").className="invalid-color";
            }
            this.spinner.hide();
            return;
        }
        for (var i = 0; i < this.datatypes.length; i++) {
            var chk = document.getElementById("chk_" + this.datatypes[i].id) as HTMLInputElement;
            if (chk.checked == true) {
                if (chk.checked == true) {
                    this.datatypeId = this.datatypes[i].id
                }
            }
        }
        this.annotationmodel=[];
        for (var i = 0; i < this.annotationtypes.length; i++) {
            var chk = document.getElementById("annotation_" + this.annotationtypes[i].id) as HTMLInputElement;
            if (chk.checked == true) {
                this.annotationmodel.push({
                    annotationTypeId: this.annotationtypes[i].id
                })
            }
        }
        for (var i = 0; i < this.datasources.length; i++) {
            var chk = document.getElementById("radio_" + this.datasources[i].id) as HTMLInputElement;
            if (chk.checked == true) {
                this.datasourceId = this.datasources[i].id
            }
        }
        var data = {
            Name: this.projectname,
            Code: this.projectcode,
            DataTypeId: this.datatypeId,
            AnnotationTypeModel: this.annotationmodel,
            DataSourceId: this.datasourceId,
            StatusId:parseInt(this.statusId),
            TeamId:parseInt(this.teamId),
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }

        this.authService.SaveProject(data).subscribe((data: any) => {
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Project added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/projects/project']);
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