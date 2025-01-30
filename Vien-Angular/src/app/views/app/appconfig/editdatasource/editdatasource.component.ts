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
    selector: 'app-editdatasource',
    templateUrl: './editdatasource.component.html'
})
export class EditDatasourceComponent implements OnInit, OnDestroy {
    datasourcesubmitted = false;
    datasourceForm: FormGroup;
    datasourcename: string;
    description: string;
    DatasourceId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.datasourceForm = this.formBuilder.group({
            dname: ['', Validators.required]
        });

    }
    get r() { return this.datasourceForm.controls; }

    ngOnInit() {
        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
        this.Edit(id, value);
    }
    canceladddatasource() {
        this.router.navigateByUrl('app/appconfig/datasource');
    }
    ngOnDestroy() {

    }
    Edit(id: any, value: any) {
        if (value == "view") {
            (document.getElementById("txtdatasourcename") as HTMLInputElement).disabled = true;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            (document.getElementById("txtdatasourcename") as HTMLInputElement).disabled = false;
            (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.DatasourceId = id;
        this.authService.GetDataSourceById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.datasourcename = finalresult.result.name;
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
    UpdateDataSource() {
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
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id: parseInt(this.DatasourceId)
        }
        this.authService.UpdateDataSource(data).subscribe((data: any) => {
           
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.spinner.hide();
                this.notifications.success('Success', "Datasource Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

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