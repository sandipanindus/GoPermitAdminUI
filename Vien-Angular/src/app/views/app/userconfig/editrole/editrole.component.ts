import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-editrole',
    templateUrl: './editrole.component.html'
})
export class EditRoleComponent implements OnInit, OnDestroy {
    rolesubmitted = false;
    roleForm: FormGroup;
    rolename: string;
    description: string;
    RoleId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    constructor(private spinner:NgxSpinnerService,private translate:TranslateService,
        private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.roleForm = this.formBuilder.group({
            rname: ['', Validators.required],
            rdescription:['']
        });

    }
    get r() { return this.roleForm.controls; }

    ngOnInit() {
       // this.spinner.show();
        var id = this.approute.snapshot.params['id'];
        var value = this.approute.snapshot.params['value'];
        this.Edit(id, value);
    }
    canceladdrole() {
        this.router.navigateByUrl('app/userconfig/role');
    }
    spinnerload() {
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
     
      ngAfterViewInit(): void {
       // this.spinnerload();
      }
    ngOnDestroy() {

    }
    Edit(id: any, value: any) {
        if (value == "view") {
            this.buttonDisabled=true;
            this.roleForm.controls['rname'].disable();
            this.roleForm.controls['rdescription'].disable();

            // (document.getElementById("txtrolename") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtdescription") as HTMLInputElement).disabled = true;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        }
        else {
            this.buttonDisabled=false;
            this.roleForm.controls['rname'].enable();
            this.roleForm.controls['rdescription'].enable();

            // (document.getElementById("txtrolename") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtdescription") as HTMLInputElement).disabled = false;
            // (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        }
        this.RoleId = id;
        this.authService.GetRolesById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.rolename = finalresult.result.name;
                this.description = finalresult.result.description;
               // this.spinner.hide();
            }
            else {
               // this.spinner.hide();
                this.alert(finalresult.message);
            }
        }, (error) => {
           // this.spinner.hide();
            this.error(error.message);

        });
        
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
    UpdateRole() {
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
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id: parseInt(this.RoleId)
        }
        this.authService.UpdateRole(data).subscribe((data: any) => {
           
            var result = JSON.parse(data);
            if (result.status == "200") {
                element.style.display = 'none';
               this.onSuccess('Role updated successfully');
               
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