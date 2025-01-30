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
    selector: 'app-editdatatype',
    templateUrl: './editdatatype.component.html'
})
export class EditDatatypeComponent implements OnInit, OnDestroy {
    datatypesubmitted = false;
    datatypeForm: FormGroup;
    datatypename: string;

    DatatypeId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.datatypeForm = this.formBuilder.group({
            dname: ['', Validators.required]
        });

    }
    get r() { return this.datatypeForm.controls; }

    ngOnInit() {
        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.Edit(id, value);
    }
    canceladddatatype() {
        this.router.navigateByUrl('app/appconfig/datatype');
    }
    ngOnDestroy() {

    }
    Edit(id: any, value: any) {
        if (value == "view") {
            (document.getElementById("txtdatatypename") as HTMLInputElement).disabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            (document.getElementById("txtdatatypename") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.DatatypeId = id;
        this.authService.GetDataTypeById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.datatypename = finalresult.result.name;
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
    UpdateDataType() {
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
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id: parseInt(this.DatatypeId)
        }
        this.authService.UpdateDataType(data).subscribe((data: any) => {
            
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Datatype Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

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