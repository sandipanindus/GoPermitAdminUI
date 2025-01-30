import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
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
       .dflex{
         display:flex !important;
       }
      }
      @media screen and (max-width: 360px) {

        .scroll{
          overflow:scroll !important;
        }
        .dflex{
          display:flex !important;
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
        .dflex{
          display:flex !important;
        }
      }
    `
  ]
})
export class UserComponent implements OnInit, OnDestroy {
  firstname = '';
  sitename = '';
  lastname = '';
  email = '';
  showpage = false;
  label = "menu.user";
  edit: boolean = false;
  add: boolean = false;
  view: boolean = false;
  delete: boolean = false;
  modules: any = [];
  UserId: any;
  modalRef: BsModalRef;
  message: string;
  totalItems;
  currentPage: number = 1;
  siteshow = false;
  currentPageEvent = 1;
  page: number;
  orderbyname: string = '';
  orderbydirection: string;
  limitsMaxSize = 10;
  limitsCurrentPage = 1;
  itemsPerPage: number = 10;
  totalPage: number;

  @Input() itemOptionsPerPage = [20, 50, 100];

  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  sortDir = 1;
  users: any = [];
  constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private modalService: BsModalService,
    private router: Router, private renderer: Renderer2,
    private notifications: NotificationsService, private authService: AuthService) {
    // this.sortArr('firstName');
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'right-menu');
    this.GetScreens();
    this.GetUsers();


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
    this.users.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
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

  pageChanged(event: any): void {
    debugger;
    this.page = event.page;
    this.currentPage = this.page;
    this.GetUsers();
  }
  setPage(pageNo: number): void {
    this.currentPage = pageNo;
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

  GetUsers() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    if (RoleId == "1") {
      this.siteshow = true;
    }
    else {
      this.siteshow = false;
    }
    this.authService.GetUsers(this.currentPage, this.itemsPerPage, loginId, RoleId, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      debugger;
      if (finalresult.status == "200") {
        element.style.display = 'none';
        this.users = finalresult.result;
        //this.orderbydirection='desc';
        if (this.users.length > 0) {
          this.totalItems = this.users[0].totalItem;
          this.totalPage = this.users[0].totalPage;
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
        element.style.display = 'none';
        this.alert(result.message);
        //this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    }, (error) => {
      element.style.display = 'none';
      this.error(error.message);
      //this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
  }

  Clear() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.sitename = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.GetUsers();
  }
  SearchUser() {
    debugger;
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    if (this.firstname != '' || this.lastname != '' || this.email != '' || this.sitename != '') {
      this.authService.GetSearchUsers(this.currentPage, this.itemsPerPage, this.firstname, this.lastname, this.email, this.sitename, loginId, RoleId, SiteId).subscribe((result: any) => {
        var finalresult = JSON.parse(result);
        if (finalresult.status == "200") {
          this.users = finalresult.result;
          element.style.display = 'none';
          if (this.users.length > 0) {
            this.totalItems = this.users[0].totalItem;
            this.totalPage = this.users[0].totalPage;


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
          this.alert(result.message);
          // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        }
      }, (error) => {
        element.style.display = 'none';
        this.error(error.message);
        //this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      });
    }
    else {
      element.style.display = 'none';
      window.location.reload();
    }

  }
  GetScreens() {
    //  this.spinner.show();
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var RoleId = localStorage.getItem("RoleId");
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetScreens(RoleId, loginId, 0).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        this.modules = data.result;
        element.style.display = 'none';
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
        element.style.display = 'none';
        this.alert(result.message);
        //  this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      element.style.display = 'none';
      this.error(error.message);
      //  this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'right-menu');
  }
  openModal(template: TemplateRef<any>, id) {
    this.UserId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.deleteUser(parseInt(this.UserId))
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
  getItems() {

  }

  showAddUserModal() {
    this.router.navigate(['app/userconfig/adduser']);
  }



  showEditUserModal(id) {
    var value = "edit";
    this.router.navigate(['app/userconfig/edituser/' + id + '/' + value]);
  }

  showViewUserModal(id) {
    var value = "view";
    this.router.navigate(['app/userconfig/edituser/' + id + '/' + value]);
  }
  deleteUser(id) {
    // this.spinner.show();
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.authService.DeleteUser(id).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        //  this.spinner.hide();
        element.style.display = 'none';
        this.onSuccess("User deleted successfully");
        // this.notifications.success('Success', "User deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        // this.spinner.hide();
        element.style.display = 'none';
        this.alert(result.message);
        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      // this.spinner.hide();
      element.style.display = 'none';
      this.error(error.message);
      // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

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
    this.GetUsers();
  }


}
