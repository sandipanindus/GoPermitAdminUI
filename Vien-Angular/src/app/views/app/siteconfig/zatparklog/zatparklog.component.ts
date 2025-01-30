import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-zatparklog',
  templateUrl: './zatparklog.component.html',
  styles: [
    `@media screen and (max-width: 330px) {
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
  ],
  providers: [
    [DatePipe]
  ]
})
export class ZatparkComponent implements OnInit, OnDestroy {
  sitename = '';
  tenant = '';
  bayname = '';
  label = "menu.zatpark";
  fromdate = new Date();
  todate = new Date();
  view: boolean = false;
  edit: boolean = false;
  add: boolean = false;
  delete: boolean = false;
  modules: any = [];
  ZatparkId: any;
  showpage = false;
  modalRef: BsModalRef;
  message: string;
  totalItems;
  currentPage: number = 1;
  sortDir = 1;
  currentPageEvent = 1;
  page: number;

  limitsMaxSize = 10;
  limitsCurrentPage = 1;
  itemsPerPage: number = 10;
  totalPage: number;

  @Input() itemOptionsPerPage = [20, 50, 100];

  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  zatparklogs: any = [];

  constructor(private datePipe: DatePipe, private translate: TranslateService, private spinner: NgxSpinnerService, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService,) { }

  ngOnInit() {
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    this.renderer.addClass(document.body, 'right-menu');
    this.GetScreens();
    this.GetZatparkLogs();
  }
  GetScreens() {
    debugger;
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
        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    })
  }
  Clear() {
    this.sitename = '';
    this.tenant = '';
    this.bayname = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.GetZatparkLogs();
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
    this.zatparklogs.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  SearchZatpark() {
    debugger;
    var element = document.getElementById("loading") as HTMLDivElement;
    element.style.display = 'block';
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    var fromdate=this.datePipe.transform(this.fromdate, "yyyy-MM-dd");
    var todate=this.datePipe.transform(this.todate, "yyyy-MM-dd");
    if (this.sitename != '' || this.tenant != '' || this.bayname != '' || fromdate !='' || todate!='') {

      if(this.fromdate!=undefined && this.todate!=undefined){
        let date1= this.datePipe.transform(this.fromdate,"dd-MM-yyyy");
        let date2= this.datePipe.transform(this.todate,"dd-MM-yyyy");
        if(date2<date1){
            this.alert("to date should be greater than from date");
            element.style.display = 'none';

            return;
        }
    }

      this.authService.GetSearchZatParkLogs(this.currentPage, this.itemsPerPage, this.tenant, this.sitename, this.bayname,fromdate,todate, SiteId).subscribe((result: any) => {
        var finalresult = JSON.parse(result);
        if (finalresult.status == "200") {
          this.zatparklogs = finalresult.result;

          element.style.display = 'none';
          if (this.zatparklogs.length > 0) {
            this.totalItems = this.zatparklogs[0].totalItem;
            this.totalPage = this.zatparklogs[0].totalPage;

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
          //  this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        }
      }, (error) => {
        element.style.display = 'none';
        this.error(error.message);
        // this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      });
    }
    else {
      element.style.display = 'none';
      window.location.reload();
    }

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
  GetZatparkLogs() {
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    this.authService.GetZatparkLogs(this.currentPage, this.itemsPerPage, loginId, RoleId, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        debugger;
        this.zatparklogs = finalresult.result;
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'none';
        if (this.zatparklogs.length > 0) {
          this.totalItems = this.zatparklogs[0].totalItem;
          this.totalPage = this.zatparklogs[0].totalPage;
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
        this.alert(result.message);
        //  this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

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
    // this.spinnerload();
  }






  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'right-menu');
  }

  getItems() {

  }






  onChangeItemsPerPage(item) {
    this.itemsPerPageChange.emit(item);
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.GetZatparkLogs();
  }

  pageChanged(event: any): void {
    debugger;
    this.page = event.page;
    this.currentPage = this.page;
    this.GetZatparkLogs();
  }
  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  onPage(event) {
  }



  onDetailToggle(event) {
  }






}
