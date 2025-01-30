import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-annotationtype',
  templateUrl: './annotationtype.component.html'
})
export class AnnotationtypeComponent implements OnInit, OnDestroy {
  @ViewChild('myTable') table: any;
  expanded: any = {};
  timeout: any;
  rows
  //itemsPerPage = 10;
  ColumnMode = ColumnMode;
  columns = [
    { prop: 'name', name: 'Name' },
    { prop: 'dataTypeName', name: 'dataTypeName' },
    { prop: 'id', name: 'Actions' },
  ];
  temp
  label = "menu.annotationtype";
  edit: boolean = false;
  add: boolean = false;
  delete: boolean = false;
  view: boolean = false;
  modules: any = [];
  displayOptionsCollapsed = false;
  AnnotationtypeId: any;
  modalRef: BsModalRef;
  message: string;
  @Input() showOrderBy = true;
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @Input() showDisplayMode = true;
  @Input() displayMode = 'list';
  @Input() selectAllState = '';
  @Input() itemsPerPage = 10;
  @Input() itemOptionsPerPage = [5, 10, 20];
  @Input() itemOrder = { label: 'Product Name', value: 'title' };
  @Input() itemOptionsOrders = [{ label: 'Product Name', value: 'title' }, { label: 'Category', value: 'category' }, { label: 'Status', value: 'status' }];

  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();

  @ViewChild('search') search: any;
  annotationtypes: any = [];

  constructor(private spinner:NgxSpinnerService,private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService,) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'right-menu');
    this.GetScreens();
    this.GetAnnotationTypes();
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
  GetScreens() {
    var RoleId = localStorage.getItem("RoleId");
    var loginId = localStorage.getItem("ClientId");
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
  GetAnnotationTypes() {
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetAnnotationtypes(loginId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        this.annotationtypes = finalresult.result;
        this.rows = this.annotationtypes.map(({ name, dataTypeName, id }) => ({ name, dataTypeName, id }));
        this.temp = [...this.rows];
      }
      else {

        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    });
  }
  openModal(template: TemplateRef<any>, id) {
    this.AnnotationtypeId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.deleteAnnotationtype(parseInt(this.AnnotationtypeId))
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
    this.router.navigate(['app/appconfig/addannotationtype']);
  }

  showEditModal(id) {
    var value = "edit";
    this.router.navigateByUrl('app/appconfig/editannotationtype/' + id + '/' + value);
  }
  showViewModal(id) {
    var value = "view"
    this.router.navigateByUrl('app/appconfig/editannotationtype/' + id + '/' + value);
  }

  deleteAnnotationtype(id) {
    this.spinner.show();
    this.authService.DeleteAnnotationtype(id).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        this.spinner.hide();
        this.notifications.success('Success', "Annotationtype deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        this.spinner.hide();
        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    })
  }




  onPage(event) {
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    const temp = this.temp.filter(item => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          return true;
        }
      }
    });
    this.rows = temp;
    this.table.offset = 0;
  }


  onSelectDisplayMode(mode: string) {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem() {
    this.addNewItem.emit(null);
  }
  selectAll(event) {
    this.selectAllChange.emit(event);
  }
  onChangeItemsPerPage(item) {
    this.itemsPerPageChange.emit(item);
    this.itemsPerPage = item;
  }

  onChangeOrderBy(item) {
    this.itemOrder = item;
    this.changeOrderBy.emit(item);
  }

  onSearchKeyUp($event) {
    debugger;
    this.searchKeyUp.emit($event);
    this.updateFilter($event)
  }




}
