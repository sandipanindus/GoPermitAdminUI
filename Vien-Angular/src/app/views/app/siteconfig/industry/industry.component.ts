import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss']
})
export class IndustryComponent implements OnInit {
  label = "menu.industry";
  view: boolean = false;
  edit: boolean = false;
  add: boolean = false;
  delete: boolean = false;
  modules: any = [];
  sortDir = 1;
  totalItems;
  itemsPerPage: number = 10;

  industries: any[] = []; // Store industries from API



  sitename = '';
  email = '';
  mobileno = '';

  @Input() itemOptionsPerPage = [20, 50, 100];
  
  // industries=[{name:'abc',email:'abc@gmail.com',mobileNumber:'9090090099'}]

  constructor(private authService: AuthService,private translate:TranslateService,
    private router:Router,private notifications: NotificationsService,private modalService: BsModalService,) { }

  ngOnInit(): void {
    this.GetScreens();
    this.GetIndustries(); // Fetch industries on component load

  }

  // Fetch industries from the API
  GetIndustries() {
    this.authService.GetAllIndustries().subscribe(
      (data: any) => {
        console.log("API Full Response:", data); // Log the entire response
  
        if (data) {
          this.industries = data; // Assign the full response directly
          console.log("Industries List:", this.industries);
        } else {
          console.error("Empty response from API");
        }
      },
      (error) => {
        console.error("API Error:", error);
      }
    );
  }
  


  GetScreens() {
     ;
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
    // this.sites.sort((a, b) => {
    //   a = a[colName].toLowerCase();
    //   b = b[colName].toLowerCase();
    //   return a.localeCompare(b) * this.sortDir;
    // });
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

  showpage
  currentPage
  pageChanged(event: any): void {
     ;
  //   this.page = event.page;
  //   this.currentPage = this.page;
  //  this.GetSites();
  }
  setPage(pageNo: number): void {
  //  this.currentPage = pageNo;
  }

  showAddNewModal(){
  this.router.navigateByUrl('app/siteconfig/addIndustry');
  }

  showEditModal(id) {
    var value = "edit";
    this.router.navigate(['app/siteconfig/editIndustry/' + id + '/' + value]);
  }

  showViewModal(id) {
    var value = "view";
    this.router.navigate(['app/siteconfig/editIndustry/' + id + '/' + value]);
  }

  Clear(){

  }

  SearchIndustry(){

  }

  modalRef: BsModalRef;
  IndustryId
   openModal(template: TemplateRef<any>, id) {
       this.IndustryId = id;
      this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    
  decline(): void {

    this.modalRef.hide();
  }

    confirm(): void {
      this.deleteIndustry(parseInt(this.IndustryId))
      this.modalRef.hide();
    }

  deleteIndustry(id: number) {
    this.authService.deleteIndustry(id).subscribe((result:any)=>{
    {
        this.GetIndustries(); // Refresh the list after deletion
        this.onSuccess('Industry deleted successfully!');
      }
     (error) => {
        console.error("Error deleting industry:", error);
      }
    });
  }
  
  
  
}
