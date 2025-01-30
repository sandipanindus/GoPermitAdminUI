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
    selector: 'app-editannotationtype',
    templateUrl: './editannotationtype.component.html'
})
export class EditAnnotationtypeComponent implements OnInit, OnDestroy {
    datatypeid:number;
    datatypes: any = [];
    annotationtypesubmitted = false;
    annotationtypeForm: FormGroup;
    annotationtypename: string;
    datatypeId:string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    AnnotationtypeId:string;
    constructor(private spinner:NgxSpinnerService,private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
            this.annotationtypeForm = this.formBuilder.group({
                dname: ['', Validators.required],
                ddatatypeid: ['', Validators.required]
            });

    }
    get r() { return this.annotationtypeForm.controls; }

    ngOnInit() {
        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.GetDataTypes();
        this.Edit(id,value);
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
    canceladdannotationtype() {
        this.router.navigateByUrl('app/appconfig/annotationtype');
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
    Edit(id: any,value:any) {
        if (value == "view") {
            (document.getElementById("txtannotationtype") as HTMLInputElement).disabled = true;
            (document.getElementById("txtdatatypename") as HTMLInputElement).disabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled=true;
        }
        else {
            (document.getElementById("txtannotationtype") as HTMLInputElement).disabled = false;
            (document.getElementById("txtdatatypename") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled=false;
        }
        this.AnnotationtypeId = id;
        this.authService.GetAnnotationTypeById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.annotationtypename = finalresult.result.name;
                this.datatypeId = finalresult.result.dataTypeId;
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }

    UpdateAnnotationType() {
        this.spinner.show();
        this.annotationtypesubmitted = true;
        if (this.annotationtypeForm.invalid) {
            if (this.annotationtypename == "" || this.annotationtypename == undefined || this.annotationtypename == null) {
                document.getElementById("txtannotationtype").className = "invalid-color";
            }
             if (this.datatypeId == null || this.datatypeId == undefined || this.datatypeId == "") {
                document.getElementById("txtdatatypename").className = "invalid-color";
            }
            this.spinner.hide();
            return;
        }
        this.datatypeid=parseInt(this.datatypeId);
        var data = {
            Name: this.annotationtypename,
            dataTypeId:this.datatypeid,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id:parseInt(this.AnnotationtypeId)
        }
        this.authService.UpdateAnnotationtype(data).subscribe((data: any) => {
            
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Annotationtype Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/appconfig/annotationtype']);
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