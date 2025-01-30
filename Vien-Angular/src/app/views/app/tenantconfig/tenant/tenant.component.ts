import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styles: [
    `.btnsearch{
      text-align: right;
      padding-right: 25px;
      margin-right:33px;
    }
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
      @media screen and (max-width: 425px) {
        .input_cls {
          margin-left: 0 !important;
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
export class TenantComponent implements OnInit, OnDestroy {

  label = "menu.tenant";
  view: boolean = false;
  edit: boolean = false;
  add: boolean = false;
  delete: boolean = false;
  modules: any = [];
  SiteId: any;
  modalRef: BsModalRef;
  message: string;

  @Input() itemOptionsPerPage = [10, 20, 50];

  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();

  firstname = '';
  lastname = '';
  email = '';
  mobilenumber = '';
  vrm = '';
  tenants: any = [];
  totalItems;
  currentPage: number = 1;
  sortDir = 1;
  currentPageEvent = 1;
  page: number;
  orderbyname: string = '';
  orderbydirection: string;
  limitsMaxSize = 10;
  limitsCurrentPage = 1;
  itemsPerPage: number = 10;
  totalPage: number;
  showpage = false;
  showsite = false;
  sitename = '';
  constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService,) { }

  ngOnInit() {
    this.agent=this.getBrowserName();

    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.renderer.addClass(document.body, 'right-menu');
    this.GetScreens();
    this.GetTenants();
  }

  agent

  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
        case agent.indexOf('edge') > -1:
            return 'edge';
        case agent.indexOf('opr') > -1 && !!(<any>window).opr:
            return 'opera';
        case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
            return 'chrome';
        case agent.indexOf('trident') > -1:
            return 'ie';
        case agent.indexOf('firefox') > -1:
            return 'firefox';
        case agent.indexOf('safari') > -1:
            return 'safari';
        default:
            return 'other';
    }
  }
  GetScreens() {

    var RoleId = localStorage.getItem("RoleId");
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetScreens(RoleId, loginId, 0).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        this.modules = data.result;
        for (var i = 0; i < this.modules.length; i++) {
          for (var j = 0; j < this.modules[i].screensModel.length; j++) {
            if (this.label == this.modules[i].screensModel[j].label) {
              this.edit = this.modules[i].screensModel[j].edit;
              this.add = this.modules[i].screensModel[j].add;
              this.delete = this.modules[i].screensModel[j].delete;
              this.view = this.modules[i].screensModel[j].view;
            }
          }
        }
      }
      else {
        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    })
  }
  onSortClick(event, val) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('up')) {
      classList.remove('up');
      classList.add('down');
      this.sortDir = -1;
    } else {
      classList.add('up');
      classList.remove('down');
      this.sortDir = 1;
    }
    this.sortArr(val);
  }

  sortArr(colName: any) {
    this.tenants.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  pageChanged(event: any): void {
    debugger;
    this.page = event.page;
    this.currentPage = this.page;
    this.GetTenants();
  }
  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }
  Clear() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.sitename = '';
    this.mobilenumber = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.vrm='',
    this.GetTenants();
  }
  SearchTenant() {
    debugger;
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    var firstname=this.firstname.trim();
    var lastname=this.lastname.trim();
    var email=this.email.trim();
    var vrm=this.vrm.trim();
    var sitename=this.sitename.trim();
    console.log(sitename);
    if (this.firstname != '' || this.lastname != '' || this.email != '' || this.vrm != '' || this.mobilenumber || sitename) {
      this.authService.GetSearchTenants(this.currentPage, this.itemsPerPage,firstname,lastname,email, this.mobilenumber, sitename, SiteId,vrm).subscribe((result: any) => {
        debugger;
        var finalresult = JSON.parse(result);
        if (finalresult.status == "200") {
          this.tenants = finalresult.result;
          element.style.display = 'none';
          if (this.tenants.length > 0) {
            this.totalItems = this.tenants[0].totalItem;
            this.totalPage = this.tenants[0].totalPage;

              this.showpage = false;

          }
          else {
            this.totalItems = 0;
            this.totalPage = 0;
              this.showpage = false;


          }
        }
        else {
          element.style.display = 'none';
          // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        }
      }, (error) => {
        element.style.display = 'none';
        this.errormsg(error.message);
        // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      });
    }
    else {
      element.style.display = 'none';
      window.location.reload();
    }

  }
  GetTenants() {

    var objreq={
      Agent:this.agent,
      RegisterUserId:parseInt(localStorage.getItem("LoginId")),
      RoleId:localStorage.getItem("RoleId"),
      Operation:"fetching tanant details",
      Function:"get all tenants"
    }
        this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
    
        })


    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    if (RoleId == "1") {
      this.showsite = true;
    }
    else {
      this.showsite = false;
    }
    this.authService.GetTenantUsers(this.currentPage, this.itemsPerPage, loginId, RoleId, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        debugger;
        this.tenants = finalresult.result;

        element.style.display = 'none';
        if (this.tenants.length > 0) {
          this.totalItems = this.tenants[0].totalItem;
          this.totalPage = this.tenants[0].totalPage;
          if (this.totalItems > this.itemsPerPage) {
            this.showpage = true;
          }
          else {
            this.showpage = false;
          }
        }
        else {
          this.totalItems = 0;
          this.totalPage = 0;
          if (this.currentPage != 1) {
            this.showpage = true;
          }
          else {
            this.showpage = false;
          }

        }
      }
      else {

        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    });
  }
  spinnerload() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 1000);
  }

  ngAfterViewInit(): void {
    //this.spinnerload();
  }
  openModal(template: TemplateRef<any>, id) {
    this.SiteId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.deleteTenant(parseInt(this.SiteId))
    this.modalRef.hide();
  }

  decline(): void {

    this.modalRef.hide();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'right-menu');
  }

  getItems() {

  }

  showAddNewModal() {
    this.router.navigate(['app/tenantconfig/addtenant']);
  }

  showEditModal(id) {
    var value = "edit";
    var objreq={
      Agent:this.agent,
      RegisterUserId:parseInt(localStorage.getItem("LoginId")),
       RoleId:localStorage.getItem("RoleId"),
      Operation:"fetching tanant details for edit",
      Function:"get tenants"
    }
        this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
    
        })
    this.router.navigateByUrl('app/tenantconfig/edittenant/' + id + '/' + value);
  }
  showViewModal(id) {
    var value = "view";
    this.router.navigateByUrl('app/tenantconfig/edittenant/' + id + '/' + value);
  }
  onSuccess(msg) {
    this.notifications.create(this.translate.instant('Success'),
      this.translate.instant(msg), NotificationType.Success,
      { timeOut: 3000, showProgressBar: true });
  }
  errormsg(msg) {
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
  deleteTenant(id) {
    var element = document.getElementById("loading") as HTMLDivElement;


    var objreq={
      Agent:this.agent,
      RegisterUserId:parseInt(localStorage.getItem("LoginId")),
      RoleId:localStorage.getItem("RoleId"),
      Operation:"deleting tanant details",
      Function:"delete tenant",
      TenantId:parseInt(id)
    }
        this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
    
        })
    element.style.display = 'block';
    this.authService.DeleteUser(id).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        element.style.display = 'none';
        this.onSuccess("Tenant deleted successfully");
        //this.notifications.success('Success', "Tenant deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      else {
        element.style.display = 'none';
        this.alert(result.message);
       // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    })
  }



  onPage(event) {
  }


  onDetailToggle(event) {
  }






  onChangeItemsPerPage(item) {
    this.itemsPerPageChange.emit(item);
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.GetTenants();
  }

}
