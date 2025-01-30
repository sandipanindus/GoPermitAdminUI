import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/auth.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';


import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { Colors } from '../../../../constants/colors.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';




const colors: any = {
  
  color2: {
    primary: Colors.getColors().themeColor2,
    secondary: Colors.getColors().themeColor2_10
  }
};
@Component({
  selector: 'app-visitor-shedule',
  templateUrl: './visitor-shedule.component.html',
  styleUrls: ['./visitor-shedule.component.scss']
})
export class VisitorSheduleComponent implements OnInit {
//calener

@ViewChild('template') model: any;

view: CalendarView = CalendarView.Month;
CalendarView = CalendarView;
viewDate: Date = new Date();

refresh: Subject<any> = new Subject();

events: CalendarEvent[] = [
  


];



 sentence: any ="Hello, welcome to the world of typescript,\n"+
 "the typed super of javascript"
showalert: boolean = true;
showdatepicker: boolean = false;
showtable: boolean = false;
showdetails: boolean = false;
//calender


modalRef: BsModalRef;


  loginid: any;
  sites: any;
  siteId: any;


  constructor(private spinner: NgxSpinnerService,private authService: AuthService,private modalService: BsModalService,) { 
    this.loginid= parseInt(localStorage.getItem("LoginId"));

  }

  ngOnInit(): void {

   

this.GetSites();


  }


  //calendar





  getDateItem(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
 iterations:any
 Visitordetails:any
eventClicked(data)
{
  debugger
  this.spinner.show();
this.showtable=false;

  this.authService.Getvistorbysitedate(this.siteId, this.getDateItem(data.date)).subscribe((result: any) => {
    debugger;
    const finalresult = JSON.parse(result);
    if(finalresult.message === 'Success') {
      this.Visitordetails = finalresult.result;
      if(finalresult.result.length>0){
      this.showtable = true;
     

        setTimeout(() => {
          this.spinner.hide();
      //     var fcBody = document.querySelector(".fix-column > .tbody"),
      //     rcBody = document.querySelector(".rest-columns > .tbody"),
      //     rcHead = document.querySelector(".rest-columns > .thead");
      // rcBody.addEventListener("scroll", function() {
      //     fcBody.scrollTop = this.scrollTop;
      //     rcHead.scrollLeft = this.scrollLeft;
      // }, { passive: true });
          this.assigntoTable();
        }, 2000);
      }
    }
  });
  setTimeout(() => {
    this.spinner.hide();
  }, 2000);
}

  //calendar

  /**
   * table assign values
   * vrm no and time
   */

 assigntoTable() {
   
  debugger 

    for ( let i = 0 ; i < this.Visitordetails.length ; i++ ) {

      for ( let j = 0 ; j < this.Visitordetails[i].result.length ; j++ ) {

        var d = new Date(this.Visitordetails[i].result[j].startDate);
        var n = d.getHours();

        (document.getElementById(n +'-' + (this.Visitordetails[i].id))).innerHTML += '<p       data-tooltip="Hovered content"  style="background: gold; border-radius:4px;text-align: center;margin-bottom:0px !important;" class="cls'+ this.Visitordetails[i].result[j].id +'" id="'+ this.Visitordetails[i].result[j].id +'" > '+ this.Visitordetails[i].result[j].vrmNumber +'  <br> </p>';
      
        
        
      
        //document.getElementById(('0-' + (this.Visitordetails[i].id)).innerHTML="newtext";
       // (document.getElementById(n +'-' + (this.Visitordetails[i].id)) as HTMLInputElement).setAttribute("name", this.Visitordetails[i].result[j].id);
      }

      for ( let i = 0 ; i < this.Visitordetails.length ; i++ ) {

        for ( let j = 0 ; j < this.Visitordetails[i].result.length ; j++ ) {
          setTimeout(() => {
            let children = document.getElementsByClassName('cls'+this.Visitordetails[i].result[j].id);
  
          for (let i = 0; i < children.length; i++) {
              children[i].addEventListener("mouseenter", (event: Event) => {
                this.testing(event);
              });
          }
          }, 3000);
        }
      }

    }

 }
details:any;
count=1;
 testing(id){
  debugger;
  var length=this.Visitordetails.length ; 
if(this.count==length)
{
  this.showdetails=false;
  
  this.authService.Getvistordeatilsbyid(id.toElement.id).subscribe((result: any) => {
    debugger;
    var finalresult = JSON.parse(result);
    if (finalresult.status == "200") {
      console.log(finalresult);
      this.showdetails=true;
      this.count=1;

      this.details=finalresult.result;

     // this.openModal(this.model)
    }

  })

}
else
{
  this.count++;
}


   
  //var name =(document.getElementById('20-1380') as HTMLInputElement).name;

   
 }




  GetSites() {
    this.authService.GetSitesbylogin(this.loginid).subscribe((result: any) => {
        debugger;
        //  var data = JSON.stringify(result)
        this.spinner.show();
        var finalresult = JSON.parse(result);
        if (finalresult.status == "200") {
            this.spinner.hide();
            this.sites = finalresult.result;
            if(this.sites.length === 1)
            {
              this.siteId=this.sites[0].id
              this.Getbaybysite();
            }
        }
        this.spinner.hide();
    });
}

Getbaybysite() {
  debugger
  for (let i = 0; i < this.events.length; i++) {
    this.events.splice(i, this.events.length);
  }
  this.authService.Getvistordeatilsbysite(this.siteId).subscribe((result: any) => {
    debugger;
    const responce = JSON.parse(result);
    console.log(responce);
    if (responce.status === "200") {

     
      
      this.showdatepicker=true;
      if (responce.result.length > 0) {
        for (let k = 0; k < responce.result.length; k++) {
          this.showtable=false;
          this.showdatepicker=true;
         var filterdateforbublelist= this.filtergriddata(responce.result[k].startDate);

         if (filterdateforbublelist.length == 0) {
          this.addEvent(responce.result[k].startDate);

         }
         // this.onValueChange1(new Date(data.result[0].selectedddates[k].fromDate))
        }
      }
      else
      {
        this.showtable=false;
          this.showdatepicker=false;
           this.showdetails=false;

      }
    }
  });
 
}

addEvent(date): void {
  this.events = [
    ...this.events,
    {
      start: addDays(new Date(date), 0),
                title: 'Date Configured',
                color: colors.color2
    }
  ];
}

filtergriddata(serachstring: Date) {
  debugger
  return this.events.filter(X =>
    this.getDateItem(X.start)  == this.getDateItem(new Date(serachstring)));

}

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, {animated: true, class: 'modal-dialog-centered' });
}

decline(): void {

  this.modalRef.hide();
}

}
