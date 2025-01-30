import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input, AfterViewInit } from '@angular/core';
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
    selector: 'app-editproject',
    templateUrl: './editproject.component.html',
    styleUrls: ['./editproject.component.css']
})
export class EditProjectComponent implements OnInit {
    teamId: string;
    statuses: any = [];
    teams: any = [];
    statusId: string;
    datasourceSelected: string;
    datatypeSelected: string;
    datatypemodel: any = [];
    annotationmodel: any = [];
    projectsubmitted = false;
    projectForm: FormGroup;
    projectname: string;
    projectcode: string;
    annotationdiv = 'none'
    datasources: any = [];
    datatypes: any = [];
    isdisabled = false;
    datasourceId: number;
    annotationtypes: any = [];
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    ProjectId: string;
    datatypeId: number;
    objresult: any = [];
    firstannotationtypes: any = [];
    constructor(private spinner: NgxSpinnerService, private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.projectForm = this.formBuilder.group({
            rprojectname: ['', Validators.required],
            rprojectcode: ['', Validators.required],
            rstatusId: ['', Validators.required],
            rteamId: ['', Validators.required]
        });

    }
    get r() { return this.projectForm.controls; }

    ngOnInit() {


        this.statuses = [
            {
                id: "1",
                name: "New"
            }, {
                id: "2",
                name: "In Progress"
            }, {
                id: "3",
                name: "Complete"
            }
        ]
        this.getdatasources();
        this.getdatatype();
        this.GetTeams();
        this.getannotation();

    }
 
    canceladdproject() {
        this.router.navigateByUrl('app/projects/project');
    }

    getannotation() {
        var loginId = localStorage.getItem("LoginId");
        var datatypeId = localStorage.getItem("DataTypeId");
        if (datatypeId != null || datatypeId != undefined || datatypeId != "0") {
            this.authService.GetAnnotationByDataTypeId(loginId, datatypeId).subscribe((result: any) => {
                var finalresult = JSON.parse(result);
                if (finalresult.status == "200") {
                    this.annotationtypes = finalresult.result;
                    this.annotationdiv = 'flex';
                    var id = this.approute.snapshot.params['id'];
                    var value = this.approute.snapshot.params['value'];
                    setTimeout(() => {
                        this.Edit(id, value);
                    }, 1000);


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
    spinnerload() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 2000);
    }

    ngAfterViewInit(): void {
        this.spinnerload();
    }
    getdatasources() {
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

    getdatatype() {
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
    GetTeams() {
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

    Edit(id: any, value: any) {

        if (value == "view") {
            (document.getElementById("txtprojectname") as HTMLInputElement).disabled = true;
            (document.getElementById("txtprojectcode") as HTMLInputElement).disabled = true;
            (document.getElementById("txtstatusId") as HTMLInputElement).disabled = true;
            (document.getElementById("txtteamId") as HTMLInputElement).disabled = true;
            this.isdisabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            (document.getElementById("txtprojectname") as HTMLInputElement).disabled = false;
            (document.getElementById("txtprojectcode") as HTMLInputElement).disabled = false;
            (document.getElementById("txtstatusId") as HTMLInputElement).disabled = false;
            (document.getElementById("txtteamId") as HTMLInputElement).disabled = false;
            this.isdisabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.ProjectId = id;
        this.authService.GetProjectById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            debugger;
            if (finalresult.status == "200") {
                this.objresult = finalresult.result.annotationtypes;
                this.projectname = finalresult.result.name;
                this.projectcode = finalresult.result.code;
                this.datasourceId = finalresult.result.dataSourceId;
                this.datatypeId = finalresult.result.dataTypeId;
                this.statusId = finalresult.result.statusId;
                this.teamId = finalresult.result.teamId;
                this.datasourceSelected = this.datasourceId.toString();
                this.datatypeSelected = this.datatypeId.toString();
                for (var i = 0; i < finalresult.result.annotationtypes.length; i++) {
                    var chk2 = document.getElementById("annotation_" + finalresult.result.annotationtypes[i].annotationTypeId) as HTMLInputElement;
                    if (chk2 != null)
                        chk2.checked = true
                }
                if (this.teamId == null || this.teamId == undefined || this.teamId=="0") {
                    this.teamId = "";
                }
            }

        });

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
                        if (this.datatypeId != null || this.datatypeId != 0) {
                            this.getannotation();
                        }
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


    UpdateProject() {

        this.spinner.show();
        this.projectsubmitted = true;
        if (this.projectForm.invalid) {
            if (this.projectname == null || this.projectname == undefined || this.projectname == "") {
                document.getElementById("txtprojectname").className = "invalid-color";
            }
            if (this.projectcode == null || this.projectcode == undefined || this.projectcode == "") {
                document.getElementById("txtprojectcode").className = "invalid-color";
            }
            this.spinner.hide();
            return;
        }

        for (var i = 0; i < this.datatypes.length; i++) {
            var chk = document.getElementById("chk_" + this.datatypes[i].id) as HTMLInputElement;
            if (chk.checked == true) {

                this.datatypeId = this.datatypes[i].id

            }
        }
        this.annotationmodel = [];
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
            Id: parseInt(this.ProjectId),
            TeamId: parseInt(this.teamId),
            Name: this.projectname,
            Code: this.projectcode,
            DataTypeId: this.datatypeId,
            AnnotationTypeModel: this.annotationmodel,
            DataSourceId: this.datasourceId,
            StatusId: parseInt(this.statusId),
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }
        this.authService.UpdateProject(data).subscribe((data: any) => {

            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Project Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

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