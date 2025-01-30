import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-vehicleregistration',
    templateUrl: './vehicleregistration.component.html'
})
export class VehicleRegistrationComponent implements OnInit, OnDestroy {
    bayNo1:number;
    vehicleNo1:number;
    startFromdate1:Date;
    endDate1:Date;
    bayNo2:number;
    vehicleNo2:number;
    startFromdate2:Date;
    endDate2:Date;
    today = new Date();
    

    constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService, ) { }

    ngOnInit() {

    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy() {

    }
    canceladdproperty() {
        
    }
    AddUser(){

    }
    startingDate(){
        if(this.startFromdate1 !== this.today) {
            this.notifications.alert('Alert','The date must be current date', NotificationType.Alert, { theClass: 'outline primary', 
            timeOut: 2000, showProgressBar: false });
            // window.alert("The date must be today's date")
        }else if(this.startFromdate2 !== this.today) {
            this.notifications.alert('Alert','The date must be current date', NotificationType.Alert, { theClass: 'outline primary', 
            timeOut: 2000, showProgressBar: false });

        }
  
    }
}
