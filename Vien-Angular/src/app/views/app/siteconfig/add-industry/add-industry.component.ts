import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-industry',
  templateUrl: './add-industry.component.html',
  styleUrls: ['./add-industry.component.scss']
})
export class AddIndustryComponent implements OnInit, OnDestroy {

  rolesubmitted = false;
  industryForm: FormGroup;
  industryame: string;
  description: string;
  @Input() currentState = '';
  buttonDisabled = false;
  buttonState = '';
  constructor(private spinner: NgxSpinnerService, private translate: TranslateService,
      private modalService: BsModalService, private formBuilder: FormBuilder,
      private authService: AuthService, private notifications: NotificationsService, private router: Router) {
      this.industryForm = this.formBuilder.group({
          industryname: ['', Validators.required]
      });

  }
  get r() { return this.industryForm.controls; }
  ngOnInit() {

  }

  cancel() {
      this.router.navigateByUrl('app/siteconfig/industry');
  }
  ngOnDestroy() {

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

  SaveRole() {
   
  }

}
