import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
    selector: 'app-edit-role-modal',
    templateUrl: './edit-role-modal.component.html',
    styles: []
})
export class EditRoleModalComponent implements OnInit {
    modalRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right'
    };
    RoleId: number;
    rolesubmitted = false;
    roleForm: FormGroup;
    rolename: string;
    description: string;
    @ViewChild('template', { static: true }) template: TemplateRef<any>;

    constructor(private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private approute: ActivatedRoute, private notifications: NotificationsService, private router: Router) {
        this.roleForm = this.formBuilder.group({
            rname: ['', Validators.required]
        });

    }
    get r() { return this.roleForm.controls; }
    ngOnInit() {

    }

    show(id: any) {
        this.RoleId = id;
        this.authService.GetRolesById(this.RoleId).subscribe((result: any) => {
            debugger;
           // var data = JSON.stringify(result);
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.rolename = finalresult.result.name;
                this.description = finalresult.result.description;
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
        this.modalRef = this.modalService.show(this.template, this.config);
    }

    UpdateRole() {
        this.rolesubmitted = true;
        if (this.roleForm.invalid) {
            return;
        }
        var data = {
            Name: this.rolename,
            Description: this.description,
            LoginId: parseInt(localStorage.getItem("LoginId")),
            Id: this.RoleId
        }
        this.authService.UpdateRole(data).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success', "Role Updated Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false, clickToClose: true });
                
                setTimeout(() => {
                    this.modalRef.hide();
                }, 2000);
                setTimeout(() => {
                    window.location.reload();
                 }, 1000);
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }, (error) => {
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }
}
