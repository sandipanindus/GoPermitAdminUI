import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
@Component({
    selector: 'app-property',
    templateUrl: './property.component.html'
})
export class PropertyComponent implements OnInit, OnDestroy {
    active: boolean;
    countries: any = [];
    roles: any = [];
    roleid: number;
    countryid: number;
    firstname: string;
    buttonDisabled = false;
    buttonState = '';
    code: string;
    usersubmitted = false;
    propertyForm: FormGroup;
    propertyname: string;
    lastname: string;
    email: string;
    contactnumber: string;
    mobilenumber: string;
    contanctpersonname: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    countryId: string;
    zipcode: string;
    roleId: string;
    parkingbay: string;
    constructor(private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService, ) {
        this.propertyForm = this.formBuilder.group({
            rfirstname: ['', Validators.required],
            rlastname: ['', Validators.required],
            remail: ['', Validators.required]
        });

    }
    get r() { return this.propertyForm.controls; }

    ngOnInit() {


    }
    canceladdproperty() {
        this.router.navigateByUrl('app/appproperty/viewproperty');
    }
    ngAfterViewInit(): void {

    }

    ngOnDestroy() {

    }

}
