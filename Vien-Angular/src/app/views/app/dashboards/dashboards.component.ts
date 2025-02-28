import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, OnDestroy, Renderer2, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  cards = [
    { title: 'Operators', count: 0,color:'blue' },
    { title: 'Operator Users', count: 0,color:'green' },
    { title: 'Sites', count: 0 ,color:'red'},
    { title: 'Site Users', count: 0,color:'orange' }
  ];
  operatordata: any;
  sites: any;
  operatorusers: any;
  siteusers: any;

  constructor(private spinner:NgxSpinnerService, private authService: AuthService,private router: Router) { }
  // constructor(private spinner:NgxSpinnerService,private router: Router,private fb: FormBuilder, private http: HttpClient,private notifications: NotificationsService, private authService: AuthService) { }

  ngOnInit() {
    this.Getopertaors();
    this.GetSites()
    this.Getopeartoruser()
    this.getsiteusers()

   
  }
  getsiteusers() {
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
   
    this.authService.GetSiteUser(1, 10, loginId, RoleId, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
    if(finalresult){
      this.siteusers = finalresult?.result?.length;  
    }
    else{
      this.siteusers =0;
    }

    const cardToUpdate = this.cards.find(card => card.title === 'Site Users');
    if (cardToUpdate) {
      cardToUpdate.count = this.siteusers;
    }


    });

  }
  Getopeartoruser() {
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
    this.authService.Getopeartoruser(1, 10, loginId, RoleId, SiteId).subscribe((result: any) => {

      var finalresult = JSON.parse(result);
     if(finalresult){
      this.operatorusers = finalresult?.result?.length;  
     }
     else{
      this.operatorusers=0;
     }
     const cardToUpdate = this.cards.find(card => card.title === 'Operator Users');
     if (cardToUpdate) {
       cardToUpdate.count = this.operatorusers;
     }

    });

  }
 GetSites() {
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");
   
    this.authService.GetSites(1, 10, loginId, RoleId, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
     if(finalresult){
      this.sites = finalresult?.result?.length;     
     }
      else {
        this.sites=0;
     
      }
      const cardToUpdate = this.cards.find(card => card.title === 'Sites');
      if (cardToUpdate) {
        cardToUpdate.count = this.sites;
      }

    });

  }
  Getopertaors(): void {
    debugger
    var loginId = localStorage.getItem("LoginId");
    var RoleId = localStorage.getItem("RoleId");
    var SiteId = localStorage.getItem("SiteId");

    this.authService.Getoperators(1, 10, loginId, RoleId, SiteId).subscribe(
      response => {
        if (response || Array.isArray(response)) {
          response=JSON.parse(response);
  

this.operatordata=response.length;

          //this.operatordata = response; // Store the response in the operatordata array
        } else {
          this.operatordata=0;
        }
        const cardToUpdate = this.cards.find(card => card.title === 'Operators');
        if (cardToUpdate) {
          cardToUpdate.count = this.operatordata;
        }
      }
    );
  }

}
