import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
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
export class SupportComponent implements OnInit, OnDestroy {
  showsite = false;
  label = "menu.support";
  view: boolean = false;
  edit: boolean = false;
  add: boolean = false;
  delete: boolean = false;
  modules: any = [];

  ticketid: any;
  modalRef: BsModalRef;
  message: string;
  sitename = '';
  name = '';
  email = '';
  mobilenumber = '';
  subject = '';
  totalItems;
  currentPage: number = 1;

  currentPageEvent = 1;
  page: number;
  orderbyname: string = '';
  orderbydirection: string;
  limitsMaxSize = 10;
  limitsCurrentPage = 1;
  itemsPerPage: number = 10;
  totalPage: number;
  showpage = false;
  @Input() itemOptionsPerPage = [10, 20, 50];

  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  sortDir = 1;

  supports: any = [];

  constructor(private spinner: NgxSpinnerService, private translate: TranslateService, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService,) { }

  ngOnInit() {
    debugger;
    this.agent=this.getBrowserName();

    this.renderer.addClass(document.body, 'right-menu');
    this.GetScreens();
    this.GetSupportList();

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
    this.supports.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  
  SearchSupport() {
    debugger;
    var SiteId = localStorage.getItem("SiteId");
    if (this.sitename != '' || this.name != '' || this.email != '' || this.mobilenumber != '' || this.subject != '') {
      this.authService.GetSearchSupportList(this.currentPage, this.itemsPerPage, SiteId,this.sitename,this.name,this.email,this.mobilenumber,this.subject).subscribe((result: any) => {
        var finalresult = JSON.parse(result);
        if (finalresult.status == "200") {
          this.supports = finalresult.result;
          if (this.supports.length > 0) {
            this.totalItems = this.supports[0].totalItem;
            this.totalPage = this.supports[0].totalPage;

              this.showpage = false;

          }
          else {
            this.totalItems = 0;
            this.totalPage = 0;

            this.showpage = false;

          }
        }
        else {

          this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        }
      });
    }
  }
  Clear() {
    this.sitename = '';
    this.name = '';
    this.email = '';
    this.mobilenumber = '';
    this.subject = '';
    this.currentPage=1;
    this.GetSupportList();
  }
  GetSupportList() {
    var objreq={
      Agent:this.agent,
      RegisterUserId:parseInt(localStorage.getItem("LoginId")),
       RoleId:localStorage.getItem("RoleId"),
      Operation:"get supports details",
      Function:"getsupports tenants"
    }
        this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
    
        })
    var SiteId = localStorage.getItem("SiteId");
    var RoleId = localStorage.getItem("RoleId");
    if (RoleId == "1") {
      this.showsite = true;
    } else {
      this.showsite = false;
    }
    this.authService.GetSupportList(this.currentPage, this.itemsPerPage, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        debugger;
        this.supports = finalresult.result;
        if (this.supports.length > 0) {
          this.totalItems = this.supports[0].totalItem;
          this.totalPage = this.supports[0].totalPage;
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

          this.showpage = false;

        }
      }
      else {

        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    });
  }
  pageChanged(event: any): void {
    debugger;
    this.page = event.page;
    this.currentPage = this.page;
    this.GetSupportList();
  }
  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  spinnerload() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.spinnerload();
  }
  openModal(template: TemplateRef<any>, id) {
    this.ticketid = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.closeticket(parseInt(this.ticketid))
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



  showEditModal(id, ticketId) {
    var value = "edit";
    localStorage.setItem("ticketid", ticketId);

    var objreq={
      Agent:this.agent,
      RegisterUserId:parseInt(localStorage.getItem("LoginId")),
       RoleId:localStorage.getItem("RoleId"),
      Operation:"get supports details for edit",
      Function:"getsupports tenants for edit"
    }
        this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
    
        })
    this.router.navigateByUrl('app/siteconfig/editsupport/' + id + '/' + value);
  }
  showViewModal(id) {
    var value = "view";
    this.router.navigateByUrl('app/siteconfig/editsupport/' + id + '/' + value);
  }
  onSuccess(msg) {
    this.notifications.create(this.translate.instant('alert.success'),
      this.translate.instant(msg), NotificationType.Success,
      { timeOut: 3000, showProgressBar: true });
  }
  closeticket(id) {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.authService.CloseTicket(id).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        element.style.display = 'none';
        this.onSuccess("Ticket closed successfully");
        // this.notifications.success('Success', "Ticket closed successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      else {
        element.style.display = 'none';
        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
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
    this.GetSupportList();
  }



}
