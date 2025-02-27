import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-industry',
  templateUrl: './edit-industry.component.html',
  styleUrls: ['./edit-industry.component.scss']
})
export class EditIndustryComponent implements OnInit, OnDestroy {
  rolesubmitted = false;
  industryForm: FormGroup;
  industryname: string;
  description: string;
  RoleId: any;
  industryId: number = 0; // New variable for industry ID
  industryData: any = {}; // Variable to store API response
  @Input() currentState = '';
  buttonDisabled = false;
  buttonState = '';
  constructor(private spinner:NgxSpinnerService,private translate:TranslateService,
      private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
      private authService: AuthService, private notifications: NotificationsService, private router: Router) {
      this.industryForm = this.formBuilder.group({
          industryname: ['', Validators.required],
      });

  }
  get r() { return this.industryForm.controls; }

  ngOnInit() {
     // this.spinner.show();
      var id = this.approute.snapshot.params['id'];
      var value = this.approute.snapshot.params['value'];

      this.industryId = id; // Store industry ID in new variable

      this.Edit(id, value);
      this.fetchIndustryData(id);

  }


  fetchIndustryData(id: number) {
    this.authService.getIndustryById(id).subscribe(
      (response) => {
        this.industryData = response;
        console.log('api response' , this.industryData)
        this.industryForm.patchValue({ industryname: response.industryName });
      },
      (error) => {
        console.error("Error fetching industry data:", error);
        this.error("Failed to fetch industry details");
      }
    );
  }


  cancel() {
      this.router.navigateByUrl('app/siteconfig/industry');
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
//   Edit(id: any, value: any) {
//       if (value == "view") {
//           this.buttonDisabled=true;
//           this.industryForm.controls['industryname'].disable();
//       }
//       else {
//           this.buttonDisabled=false;
//           this.industryForm.controls['industryname'].enable();
//           this.industryForm.controls['rdescription'].enable();

//       }
//       this.RoleId = id;
//       // this.authService.GetRolesById(id).subscribe((result: any) => {
//       //     var finalresult = JSON.parse(result);
//       //     if (finalresult.status == "200") {
//       //         this.rolename = finalresult.result.name;
//       //         this.description = finalresult.result.description;
//       //     }
//       //     else {
//       //         this.alert(finalresult.message);
//       //     }
//       // }, (error) => {
//       //     this.error(error.message);

//       // });
      
//   }


Edit(id: any, value: any) {
    if (!this.industryForm) {
      console.error("industryForm is not initialized yet!");
      return;
    }
  
    if (value == "view") {
      this.buttonDisabled = true;
      this.industryForm.controls['industryname'].disable();
    } else {
      this.buttonDisabled = false;
      this.industryForm.controls['industryname'].enable();
    }
  
    this.RoleId = id;
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

//   UpdateRole() {
//       var element = document.getElementById("loading") as HTMLDivElement;

//   }

UpdateRole() {
    if (this.industryForm.invalid) {
      console.error("Please fill all required fields");
      return;
    }

    const updatedIndustry = {
      id: this.industryId, // Use industryId instead of RoleId
      industryName: this.industryForm.value.industryname,
      isActive: true,
      isDelete: false,
      createdBy: "",
      createdDate: new Date().toISOString(),
      updatedBy: "",
      updatedDate: new Date().toISOString()
    };

    this.authService.updateIndustry(updatedIndustry).subscribe(
      () => {
        this.onSuccess('Industry updated successfully!');
        console.log("Industry updated successfully");
        this.router.navigateByUrl('/app/siteconfig/industry');
      },
      (error) => {
        console.error("Failed to update industry:", error);
      }
    );
  }
  

}