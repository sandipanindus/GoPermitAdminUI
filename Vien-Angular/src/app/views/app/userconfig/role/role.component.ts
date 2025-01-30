import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styles: [
    `.filtercls{
      position: absolute;
      right: 0;
    }
    @media screen and (max-width: 425px) {
      .input_cls {
        margin-left: 0 !important;
      }
     }
    @media screen and (max-width: 330px) {
       .scroll{
         overflow:scroll !important;
       }
       .filtercls{
        position: absolute;
        right: 0;
      }
      }
      @media screen and (max-width: 360px) {
        .scroll{
          overflow:scroll !important;
        }
        .filtercls{
          position: absolute;
          right: 0;
        }
      }
      @media screen and (max-width: 768px) {
        .scroll{
          overflow:scroll !important;
        }
        .filtercls{
          position: inherit;
          right: 0;
        }
      }
    `
  ]
})
export class RoleComponent implements OnInit, OnDestroy {
  roles: any = [];
  rolename = '';
  label = "menu.role";
  edit: boolean = false;
  add: boolean = false;
  view: boolean = false;
  delete: boolean = false;
  modules: any = [];
  RoleId: any;
  modalRef: BsModalRef;
  message: string;
  filtermode: any = [];
  totalItems;
  currentPage: number = 1;

  currentPageEvent = 1;
  page: number;
  showpage = false;
  limitsMaxSize = 10;
  limitsCurrentPage = 1;
  itemsPerPage: number = 10;
  totalPage: number;
  sortDir = 1;
  @Input() showItemsPerPage = true;
  @Input() itemOptionsPerPage = [20, 50, 100];
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  constructor(private translate: TranslateService, private spinner: NgxSpinnerService, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService,) { }

  ngOnInit() {

    this.renderer.addClass(document.body, 'right-menu');
    this.GetScreens();
    this.GetRoles();
  }
  spinnerload() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
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
    this.roles.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  ngAfterViewInit(): void {
    // this.spinnerload();
  }
  GetScreens() {
    var RoleId = localStorage.getItem("RoleId");
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetScreens(RoleId, loginId, 0).subscribe((result: any) => {
      var data = JSON.parse(result);
      console.log(data);
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
        // this.spinner.hide();
        this.alert(result.message);
        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      // this.spinner.hide();
      this.error(error.message);
      // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });

  }
  Clear() {
    this.rolename = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.GetRoles();
  }
  onChangeItemsPerPage(item) {
    this.itemsPerPageChange.emit(item);
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.GetRoles();
  }
  pageChanged(event: any): void {
    debugger;
    this.page = event.page;
  }


  SearchRole() {
    debugger;
    if (this.rolename != '') {
      var roles = this.filtermode.filter(x => x.name.toLowerCase().includes(this.rolename.toLowerCase()));
      this.roles = roles;
      this.totalItems = this.roles.length;
      this.showpage = false;
      // this.rows = roles.map(({ name, id }) => ({ name, id }));
      // this.temp = [...this.rows];
    } else {

      this.GetRoles();
      //this.rows = this.roles.map(({ name, id }) => ({ name, id }));
      //  this.temp = [...this.rows];
    }
  }

  GetRoles() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    this.authService.GetRoles(this.currentPage, this.itemsPerPage, loginId, RoleId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        debugger;
        element.style.display = 'none';
        this.roles = finalresult.result;
        if (this.roles.length > 0) {
          this.totalItems = this.roles[0].totalItem;
          this.totalPage = this.roles[0].totalPage;
          if (this.totalItems > this.itemsPerPage) {
            this.showpage = true;
          }
          else {
            this.showpage = false;
          }
          this.filtermode = this.roles;
        } else {
          this.totalItems = 0;
          this.totalPage = 0;


            this.showpage = false;

          this.filtermode = this.roles;
        }
        //  this.rows = this.roles.map(({ name, id }) => ({ name, id }));
        //  this.temp = [...this.rows];
        //this.spinner.hide();
      }
      else {
        element.style.display = 'none';
        //  this.spinner.hide();
        this.alert(result.message);
        //  this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    }, (error) => {
      element.style.display = 'none';
      //this.spinner.hide();
      this.error(error.message);
      //this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
  }
  openModal(template: TemplateRef<any>, id) {
    this.RoleId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.deleteRole(parseInt(this.RoleId))
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
    this.router.navigate(['app/userconfig/addrole']);
  }

  showEditModal(id) {
    var value = "edit";
    this.router.navigate(['app/userconfig/editrole/' + id + '/' + value]);
  }
  showViewModal(id) {
    var value = "view";
    this.router.navigate(['app/userconfig/editrole/' + id + '/' + value]);
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
  deleteRole(id) {
    var loader=document.getElementById("loading") as HTMLDivElement;
    loader.style.display='block';
    this.spinner.show();
    this.authService.DeleteRole(id).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        loader.style.display='none';
        this.onSuccess("Role deleted successfully");
      //  this.notifications.success('Success', "Role deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        loader.style.display='none';
        this.alert(result.message);
        //this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      loader.style.display='none';
      this.error(error.message);
     // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
  }




  onPage(event) {
  }



  onDetailToggle(event) {
  }
}
