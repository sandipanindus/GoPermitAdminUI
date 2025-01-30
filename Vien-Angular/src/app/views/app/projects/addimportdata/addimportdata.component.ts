import { Component, Output, EventEmitter, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ApiService } from 'src/app/data/api.service';
import { IProduct } from 'src/app/data/api.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-addimportdata',
    templateUrl: './addimportdata.component.html',
    styleUrls: ['./addimportdata.component.css']
})
export class AddImportDataComponent implements OnInit, OnDestroy {
    displayOptionsCollapsed = false;

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
    imageuploaddiv = 'none';
    fileToUpload: File = null;
    files: Array<any> = new Array<any>();
    datasourcename: string;
    datatypename: string;
    fileuploadzipdiv = 'none';
    datasourcediv = 'none';
    fileuploadnormaldiv = 'none';
    projects: any = [];
    projectId: string;
    importdatasubmitted = false;
    importdataForm: FormGroup;
    importdataFtpForm: FormGroup;
    importdataftpsubmitted = false;
    importdataftpdiv = 'none';
    datasetname: string;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    ftpurl: string;
    ftppassword: string;
    ftpusername: string;
    ftpportno: string;
    acceptfiles: string;
    selected: IProduct[] = [];
    data: IProduct[] = [];
    currentPage = 1;
    orderBy = '';
    isLoading: boolean;
    endOfTheList = false;
    totalItem = 0;
    totalPage = 0;
    griddiv = 'none';
    @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
    constructor(private hotkeysService: HotkeysService, private apiService: ApiService, private spinner: NgxSpinnerService, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.importdataForm = this.formBuilder.group({
            ddatasetname: ['', Validators.required],
            dprojectId: ['', Validators.required]
        });
        this.importdataFtpForm = this.formBuilder.group({
            dftpurl: ['', Validators.required],
            dftpusername: ['', Validators.required],
            dftppassword: ['', Validators.required],
            dftpportno: ['', Validators.required]
        });
        this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
            this.selected = [...this.data];
            return false;
        }));
        this.hotkeysService.add(new Hotkey('ctrl+d', (event: KeyboardEvent): boolean => {
            this.selected = [];
            return false;
        }));
    }
    get r() { return this.importdataForm.controls; }
    get f() { return this.importdataFtpForm.controls; }
    ngOnInit() {

        this.GetProjects();
        this.projectId = "";
       // var Id = localStorage.getItem("DatasetId");

       // this.loaddatasetdata(parseInt(Id), this.itemsPerPage, 1, "");
        // this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
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
    BindDataSource() {
        this.spinner.show();
        this.authService.GetDataSourceName(this.projectId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);

            debugger;
            if (finalresult.status == "200") {
                this.datasourcediv = "flex";
                this.datasourcename = finalresult.result.dataSourceName;
                this.datatypename = finalresult.result.dataTypeName;
                this.spinner.hide();
                if (this.datasourcename.trim().toLowerCase() == "Image Upload".toLowerCase()) {
                    if (this.datatypename.toLowerCase() == "Image".toLowerCase()) {
                        this.acceptfiles = ".jpg, .png, .jpeg, .bmp";
                    }
                    else if (this.datatypename.toLowerCase() == "Video".toLowerCase()) {
                        this.acceptfiles = ".mp4, ";
                    }
                    else if (this.datatypename.toLowerCase() == "Text".toLowerCase()) {
                        this.acceptfiles = ".txt, ";
                    }
                    else if (this.datatypename.toLowerCase() == "Audio".toLowerCase()) {
                        this.acceptfiles = ".txt, ";
                    }
                    this.fileuploadnormaldiv = "flex";
                    this.imageuploaddiv = 'flex';
                    this.importdataftpdiv = 'none';

                }
                else if (this.datasourcename.trim().toLowerCase() == "FTP".toLowerCase()) {
                    this.importdataftpdiv = 'flex';
                    this.fileuploadnormaldiv = "none";
                    this.imageuploaddiv = 'none';
                }
            }
            else {
                this.spinner.hide();
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    onSelectZipFile(files: FileList) {
        if (files.length === 0)
            return;
        if (files.length == 1) {
            this.files = [];
            this.fileToUpload = files.item(0);
            const fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(this.fileToUpload);
            this.files.push({ data: this.fileToUpload, fileName: this.fileToUpload.name });
        }

    }
    onSelectNormalFile(files: FileList) {
        if (files.length === 0)
            return;
        if (files.length > 0) {
            this.files = [];
            for (var i = 0; i < files.length; i++) {
                this.fileToUpload = files.item(i);
                const fileReader: FileReader = new FileReader();
                fileReader.readAsDataURL(this.fileToUpload);
                this.files.push({ data: this.fileToUpload, fileName: this.fileToUpload.name });
            }

        }

    }
    OpenZipFileControl() {
        var chk = document.getElementById("customRadio1") as HTMLInputElement;
        if (chk.checked == true) {
            this.fileuploadzipdiv = 'flex';
            this.fileuploadnormaldiv = 'none';
        }
        else {
            this.fileuploadzipdiv = 'none';
            this.fileuploadnormaldiv = 'flex';
        }
    }
    OpenNormalFileControl() {
        var chk = document.getElementById("customRadio2") as HTMLInputElement;
        if (chk.checked == true) {
            this.fileuploadzipdiv = 'none';
            this.fileuploadnormaldiv = 'flex';
        }
        else {
            this.fileuploadzipdiv = 'flex';
            this.fileuploadnormaldiv = 'none';
        }
    }

    GetProjects() {
        var loginId = localStorage.getItem("LoginId");
        this.authService.GetProjects(loginId).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            if (finalresult.status == "200") {
                this.projects = finalresult.result;

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    canceladdimportdata() {
        this.router.navigateByUrl('app/projects/importdata');
    }
    ngOnDestroy() {

    }
    SaveImportData() {
        debugger;
        var loginId = localStorage.getItem("LoginId");
        this.spinner.show();
        if (this.datasourcename.trim().toLowerCase() == "Image Upload".toLowerCase()) {
            this.importdatasubmitted = true;
            if (this.importdataForm.invalid) {
                if (this.datasetname == undefined || this.datasetname == null || this.datasetname == "") {
                    document.getElementById("txtdatasetname").className = "invalid-color";
                }
                if (this.projects == undefined || this.projects == null || this.projectId == "") {
                    document.getElementById("txtprojectId").className = "invalid-color";
                }
                this.spinner.hide();
                return;
            }

            if (this.files.length > 0) {
                const formData: FormData = new FormData();
                if (this.files.length == 1) {

                    formData.append("fileupload", this.fileToUpload, this.fileToUpload.name);
                }
                else {
                    for (var i = 0; i < this.files.length; i++) {
                        formData.append("fileupload", this.files[i].data, this.files[i].fileName);
                    }
                }

                this.authService.SaveImportDataImage(formData, this.projectId, this.datasetname, loginId).subscribe((data: any) => {
                    debugger;
                    var result = JSON.parse(data);
                    if (result.status == "200") {
                        debugger;
                        localStorage.setItem("DatasetId", result.result.result.id);
                        this.spinner.hide();
                        this.notifications.success('Success', "Files added successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });
                        this.isLoading = false;
                        this.griddiv = 'inline';
                        this.data = result.result.result.data;
                        this.totalItem = result.result.result.totalItem;
                        this.totalPage = result.result.result.totalPage;
                      //  this.currentPage = result.result.result.totalPage;
                        this.setSelectAllState();


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
            else {
                this.spinner.hide();
                this.notifications.alert('Alert', "Upload atleast one zip file or normal file", NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }
        else {
            this.importdatasubmitted = true;
            if (this.importdataForm.invalid) {
                if (this.datasetname == undefined || this.datasetname == null || this.datasetname == "") {
                    document.getElementById("txtdatasetname").className = "invalid-color";
                }
                if (this.projects == undefined || this.projects == null || this.projectId == "") {
                    document.getElementById("txtprojectId").className = "invalid-color";
                }
                this.spinner.hide();
                return;
            }
            this.importdataftpsubmitted = true;
            if (this.importdataFtpForm.invalid) {
                if (this.ftpurl == undefined || this.ftpurl == null || this.ftpurl == "") {
                    document.getElementById("txtftpurl").className = "invalid-color";
                }
                if (this.ftpusername == undefined || this.ftpusername == null || this.ftpusername == "") {
                    document.getElementById("txtftpusername").className = "invalid-color";
                }
                if (this.ftppassword == undefined || this.ftppassword == null || this.ftppassword == "") {
                    document.getElementById("txtftppassword").className = "invalid-color";
                }
                if (this.ftpportno == undefined || this.ftpportno == null || this.ftpportno == "") {
                    document.getElementById("txtftpportno").className = "invalid-color";
                }
                this.spinner.hide();
                return;
            }
            var data = {
                FtpUrl: this.ftpurl,
                FtpUsername: this.ftpusername,
                FtpPassword: this.ftppassword,
                FtpPortNo: this.ftpportno,
                ProjectId: this.projectId,
                DatasetName: this.datasetname,
                LoginId: parseInt(loginId)
            }
            this.authService.SaveFtpData(data).subscribe((data: any) => {
                debugger;
                var result = JSON.parse(data);
                if (result.status == "200") {
                    this.spinner.hide();
                    this.notifications.success('Success', "Ftp saved successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });
                    localStorage.setItem("DatasetId", result.result.result.id);
                    this.isLoading = false;
                    this.griddiv = 'inline';
                    this.data = result.result.result.data;
                    this.totalItem = result.result.result.totalItem;
                    this.totalPage = result.result.result.totalPage;
                    this.setSelectAllState();
                    this.ftpurl="";
                    this.ftpportno="";
                    this.ftpusername="";
                    this.ftppassword="";
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
    }
    onSelectDisplayMode(mode: string) {
        this.changeDisplayMode.emit(mode);
        this.displayMode = mode;
    }

    selectAll(event) {
        this.selectAllChange.emit(event);
        if (event.target.checked) {
            this.selected = [...this.data];
        } else {
            this.selected = [];
        }
        this.setSelectAllState();
    }
    onChangeItemsPerPage(item) {
        this.itemsPerPageChange.emit(item);
        // this.loadData(item, 1, this.search, this.orderBy);
        var Id = localStorage.getItem("DatasetId");

        this.loaddatasetdata(parseInt(Id), item, 1, "");
    }
    pageChanged(event: any): void {
        // this.loadData(this.itemsPerPage, event.page, this.search, this.orderBy);
        var Id = localStorage.getItem("DatasetId");

        this.loaddatasetdata(parseInt(Id), this.itemsPerPage, event.page, "");
    }
    isSelected(p: IProduct) {
        return this.selected.findIndex(x => x.id === p.id) > -1;
    }
    onSelect(item: IProduct) {
        if (this.isSelected(item)) {
            this.selected = this.selected.filter(x => x.id !== item.id);
        } else {
            this.selected.push(item);
        }
        this.setSelectAllState();
    }


    onChangeOrderBy(item) {
        this.itemOrder = item;
        this.changeOrderBy.emit(item);
        this.loadData(this.itemsPerPage, 1, this.search, item.value);
        // var Id=localStorage.getItem("DatasetId");
        //  this.loaddatasetdata(parseInt(Id),this.itemsPerPage)
    }

    onSearchKeyUp(event) {
        this.searchKeyUp.emit(event);
        const val = event.target.value.toLowerCase().trim();
        var Id = localStorage.getItem("DatasetId");

        this.loaddatasetdata(parseInt(Id), this.itemsPerPage, 1, val);
    }
    loaddatasetdata(Id, pagesize: number = 10, currentpage: number = 1, search: string = '') {
        this.itemsPerPage = pagesize;
        this.currentPage = currentpage;
        this.search = search;

        this.authService.GetDatasetResponse(Id, pagesize, currentpage, search)
            .subscribe((data: any) => {
                debugger;
                var result = JSON.parse(data);
                if (result.status == "200") {
                    if (result.result.data.length > 0) {
                        this.isLoading = false;
                        this.data = result.result.data;
                        this.totalItem = result.result.totalItem;
                        this.totalPage = result.result.totalPage;
                        this.setSelectAllState();
                    }
                }

            })

    }
    loadData(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') {
        this.itemsPerPage = pageSize;
        this.currentPage = currentPage;
        this.search = search;
        this.orderBy = orderBy;

        this.apiService.getProducts(pageSize, currentPage, search, orderBy).subscribe(
            data => {
                if (data.status) {
                    this.isLoading = false;
                    this.data = data.data;
                    this.totalItem = data.totalItem;
                    this.totalPage = data.totalPage;
                    this.setSelectAllState();
                } else {
                    this.endOfTheList = true;
                }
            },
            error => {
                this.isLoading = false;
            }
        );
    }
    setSelectAllState() {
        if (this.selected.length === this.data.length) {
            this.selectAllState = 'checked';
        } else if (this.selected.length !== 0) {
            this.selectAllState = 'indeterminate';
        } else {
            this.selectAllState = '';
        }
    }
    deletemultiplefile(){
        var Id = localStorage.getItem("DatasetId");
        this.authService.DeleteMutipleDatasetFile(Id).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success', "files deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });
              this.router.navigateByUrl('app/projects/importdata')
                
            }
        }) 
    }
    onContextMenuClick(action: string, item: any) {
        debugger;
        var Id = localStorage.getItem("DatasetId");
        var datasetfileid = item.id;
        this.authService.DeleteDatasetFile(datasetfileid).subscribe((data: any) => {
            debugger;
            var result = JSON.parse(data);
            if (result.status == "200") {
                this.notifications.success('Success', "Image file deleted successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });               
                this.loaddatasetdata(parseInt(Id), this.itemsPerPage, 1, "");
            }
        })
        // console.log('onContextMenuClick -> action :  ', action, ', item.title :', item.title);
    }

}