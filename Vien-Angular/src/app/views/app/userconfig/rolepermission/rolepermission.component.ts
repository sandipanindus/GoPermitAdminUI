import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-rolepermission',
  templateUrl: './rolepermission.component.html',
  styles: [
    `
    @media screen and (max-width: 330px) {
       .scroll{
         overflow:scroll !important;
       }
      
      }
      @media screen and (max-width: 360px) {
       
        .scroll{
          overflow:scroll !important;
        }
       
      }
      @media screen and (max-width: 768px) {
        .scroll{
          overflow:scroll !important;
        }
       
      }
    `
  ]
})
export class RolePermissionComponent implements OnInit {
  roles: any = [];
  roleid: number;
  permissionsubmitted = false;
  permissionForm: FormGroup;
  modules: any = [];
  chkview: boolean | undefined;
  chkadd: boolean | undefined;
  chkedit: boolean | undefined;
  chkdelete: boolean | undefined;
  chkapproved: boolean | undefined;
  chkrejected: boolean | undefined;
  roleId: string;
  constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private modalService: BsModalService, private router: Router,
    private renderer: Renderer2, private notifications: NotificationsService,
    private authService: AuthService) {

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

  ngOnInit() {
    //this.spinner.show();
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.roleId = "";
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetRoles(1, 0, loginId, 1).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        this.roles = finalresult.result;
        // this.spinner.hide();
        element.style.display = 'none';
      }
      else {
        // this.spinner.hide();
        element.style.display = 'none';
        this.alert(result.message);
        //this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      // this.spinner.hide();
      element.style.display = 'none';
      this.error(error.message);
      //  this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });

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
  isSelectedView() {
    this.chkview = true;
  }
  isSelectedAdd() {
    this.chkadd = true;
  }
  isSelectedEdit() {
    this.chkedit = true;
  }
  isSelectedDelete() {
    this.chkdelete = true;
  }
  isSelectedApprove() {
    this.chkapproved = true;
  }
  isSelectedReject() {
    this.chkrejected = true;
  }
  chkallview(Id, modules) {
    var check = document.getElementById("CheckboxV_" + Id) as HTMLInputElement;

    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].view = true;
          }
        }
      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].view = false;
          }
        }
      }
    }
  }
  chkalladd(Id, modules) {
    var check = document.getElementById("CheckboxA_" + Id) as HTMLInputElement;
    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].add = true;
          }
        }
      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].add = false;
          }
        }
      }
    }
  }
  chkalledit(Id, modules) {
    var check = document.getElementById("CheckboxE_" + Id) as HTMLInputElement;
    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].edit = true;
          }
        }
      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].edit = false;
          }
        }
      }
    }
  }
  chkalldelete(Id, modules) {
    var check = document.getElementById("CheckboxD_" + Id) as HTMLInputElement;
    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].delete = true;
          }
        }
      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].delete = false;
          }
        }
      }
    }
  }
  chkallapprove(Id, modules) {
    var check = document.getElementById("CheckboxAP_" + Id) as HTMLInputElement;
    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].approve = true;
          }
        }
      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].approve = false;
          }
        }
      }
    }
  }
  chkallreject(Id, modules) {
    var check = document.getElementById("CheckboxR_" + Id) as HTMLInputElement;
    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].reject = true;
          }
        }
      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].moduleId == Id) {
          for (var j = 0; j < modules[i].screensModel.length; j++) {
            modules[i].screensModel[j].reject = false;
          }
        }
      }
    }
  }
  chkallrow(Id, modules) {
    debugger;
    var check = document.getElementById("CheckboxS_" + Id) as HTMLInputElement;
    if (check.checked == true) {
      for (var i = 0; i < modules.length; i++) {
        for (var j = 0; j < modules[i].screensModel.length; j++) {
          if (modules[i].screensModel[j].screenId == Id) {
            modules[i].screensModel[j].view = true;
            modules[i].screensModel[j].add = true;
            modules[i].screensModel[j].edit = true;
            modules[i].screensModel[j].delete = true;
            modules[i].screensModel[j].approve = true;
            modules[i].screensModel[j].reject = true;
          }
        }

      }
    }
    else {
      for (var i = 0; i < modules.length; i++) {
        for (var j = 0; j < modules[i].screensModel.length; j++) {
          if (modules[i].screensModel[j].screenId == Id) {
            modules[i].screensModel[j].view = false;
            modules[i].screensModel[j].add = false;
            modules[i].screensModel[j].edit = false;
            modules[i].screensModel[j].delete = false;
            modules[i].screensModel[j].approve = false;
            modules[i].screensModel[j].reject = false;
          }
        }

      }
    }
  }
  GetScreensList() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.roleid = parseInt(this.roleId);
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetScreens(this.roleid, loginId, 0).subscribe((result: any) => {
      var data = JSON.parse(result);
      console.log(data);
      if (data.status == "200") {
        this.modules = data.result;
        element.style.display = 'none';
      }
      else {
        element.style.display = 'none';
        this.alert(result.message);
        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      // this.spinner.hide();
      element.style.display = 'none';
      this.error(error.message);
      //  this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
  }
  SaveData() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.authService.SavePermissionData(this.modules).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        element.style.display = 'none';
        this.onSuccess("Permissions saved successfully");
        //this.notifications.success('Success', "Permissions saved successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
        this.modules = data.result;
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      else {
       // this.spinner.hide();
       element.style.display = 'none';
       this.alert(result.message);
       // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      //this.spinner.hide();
      element.style.display = 'none';
      this.error(error.message);
     // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
  }
}
