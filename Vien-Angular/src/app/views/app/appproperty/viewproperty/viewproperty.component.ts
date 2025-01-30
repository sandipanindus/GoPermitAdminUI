import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';
@Component({
  selector: 'app-viewProperty',
  templateUrl: './viewproperty.component.html'
})
export class ViewPropertyComponent implements OnInit, OnDestroy {
  @ViewChild('myTable') table: any;
  expanded: any = {};
  timeout: any;
  rows
  ColumnMode = ColumnMode;
  columns = [
    { prop: 'name', name: 'Name' },
    { prop: 'id', name: 'Actions' },
  ];
  temp
  label = "menu.role";
  edit: boolean = false;
  add: boolean = false;
  view: boolean = false;
  delete: boolean = false;
  modules: any = [];
  displayOptionsCollapsed = false;
  RoleId: any;
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
  roles: any = [];

  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private router: Router, private renderer: Renderer2, private notifications: NotificationsService, private authService: AuthService,) { }

  ngOnInit() {
    //this.spinner.show();
    this.itemsPerPage = 10;
    this.itemOptionsPerPage = [5, 10, 20];
    this.selectAllState = '';
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
 
  ngAfterViewInit(): void {
    this.spinnerload();
  }
  GetScreens() {
    var RoleId = localStorage.getItem("RoleId");
    var loginId = localStorage.getItem("ClientId");
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
        this.spinner.hide();
        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      this.spinner.hide();
      this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });

  }
  GetRoles() {
    var loginId = localStorage.getItem("LoginId");
    this.authService.GetRoles(1,0,loginId,1).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
        this.roles = finalresult.result;
        this.rows = this.roles.map(({ name, id }) => ({ name, id }));
        this.temp = [...this.rows];
        //this.spinner.hide();
      }
      else {
        this.spinner.hide();
        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    }, (error) => {
      this.spinner.hide();
      this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

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
    this.router.navigate(['app/appproperty/property']);
  }

  showEditModal(id) {
    var value = "edit";
    this.router.navigate(['app/userconfig/editrole/' + id + '/' + value]);
  }
  showViewModal(id) {
    var value = "view";
    this.router.navigate(['app/userconfig/editrole/' + id + '/' + value]);
  }

  deleteRole(id) {
    this.spinner.show();
    this.authService.DeleteRole(id).subscribe((result: any) => {
      var data = JSON.parse(result);
      if (data.status == "200") {
        this.spinner.hide();
        this.notifications.success('Success', "Role deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 1000, showProgressBar: false });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        this.spinner.hide();
        this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
      }
    }, (error) => {
      this.spinner.hide();
      this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

    });
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
    this.searchKeyUp.emit($event);
    this.updateFilter($event)
  }




}
