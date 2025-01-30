import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
    selector: 'app-add-new-role-modal',
    templateUrl: './add-new-role-modal.component.html',
    styles: []
})
export class AddNewRoleModalComponent implements OnInit {
    modalRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right'
    };
    rolesubmitted = false;
    roleForm: FormGroup;
    rolename: string;
    description: string;
    @ViewChild('template', { static: true }) template: TemplateRef<any>;

    constructor(private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.roleForm = this.formBuilder.group({
            rname: ['', Validators.required]
        });

    }
    get r() { return this.roleForm.controls; }
    ngOnInit() {

    }

    show() {
        this.modalRef = this.modalService.show(this.template, this.config);
    }

    SaveRole() {
        debugger;
        this.rolesubmitted = true;
        if (this.roleForm.invalid) {
            return;
        }
        var data = {
            Name: this.rolename,
            Description: this.description,
            LoginId: parseInt(localStorage.getItem("LoginId"))
        }
        this.authService.SaveRole(data).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success',"Role added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false, clickToClose: true });
                setTimeout(() => {
                    this.modalRef.hide();
                }, 1000);
                setTimeout(() => {
                    window.location.reload();
                 }, 1000);
                this.rolename='';
                this.description='';
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
               
            }
        }, (error) => {
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }
}
