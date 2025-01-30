import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input } from '@angular/core';
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

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';


import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { Colors } from '../../../../constants/colors.service';


const colors: any = {
  
  color2: {
    primary: Colors.getColors().themeColor2,
    secondary: Colors.getColors().themeColor2_10
  }
};
@Component({
  selector: 'app-parking-shedule',
  templateUrl: './parking-shedule.component.html',
  styleUrls: ['./parking-shedule.component.scss']
})
export class ParkingSheduleComponent implements OnInit {
//calendar

view: CalendarView = CalendarView.Month;
CalendarView = CalendarView;
viewDate: Date = new Date();

refresh: Subject<any> = new Subject();

events: CalendarEvent[] = [
  


];

showalert: boolean ;









  //calender
 // viewDate: Date = new Date();

  Single :boolean = false;
  multiple:boolean = false;
loginid;
showdatepicker=false;

sites:any;
siteId:any

bayid:any
baylist:any

vrmno:any;
parkingvalidfrom:any;
parkingvalidTo:any;
iterations: any = [];


bsInlineValue = new Date();

  vehicleregistersubmitted = false;
    vehicleregisterForm: FormGroup;
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private formBuilder: FormBuilder,
    private authService: AuthService, private notifications: NotificationsService, private router: Router ) { 
     this.loginid= parseInt(localStorage.getItem("LoginId"));
    }

  ngOnInit(): void {
    this.GetSites();
  }

//calendar




selecteddate;



eventClicked(data)
{
  this.showalert=true
  debugger
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 2000);
  this.selecteddate=data.date;

  this.Bindbasedondate(this.getDateItem(data.date));
}










  //calendar

  GetSites() {
    this.authService.GetSitesbylogin(this.loginid).subscribe((result: any) => {
        debugger;
        //  var data = JSON.stringify(result);
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
  this.showdatepicker=false;
  this.Single=false;
  this.multiple=false;
  this.showalert=false
  this.baylist=null
  this.authService.GetParkingBayNobysite(this.siteId).subscribe((result: any) => {
      debugger;
      //  var data = JSON.stringify(result);
      var finalresult = JSON.parse(result);
      if (finalresult.status == "200") {
          this.spinner.hide();

          this.baylist = finalresult.result;
          
      }
      this.spinner.hide();
  });
}


getDateItem(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
onbaynoset(event) {
  debugger
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 2000);
  this.Bindbasedondate(this.getDateItem(event))
}
 /**
   * binding shedule dates vise click on date
   * 
   */
  Bindbasedondate(date) {
    // this.ismultivehicel=true
    this.authService.getvehiclestimedetailsbydate(this.bayid.registerUserId.toString(), this.bayid.id.toString(), date).subscribe((data: any) => {
      if (data.status === '200') {
        this.showalert = true;

        console.log(data.result);
        if (data.result.length == 1) {
          //alert('single bay')
              this.Single = true;
              this.multiple=false;
            this.vrmno = data.result[0].vrm;
            this.parkingvalidfrom = new Date(data.result[0].startDate)
            this.parkingvalidTo = new Date(data.result[0].endDate)

        }
        else if (data.result.length > 0) {
          console.log(data);
this.Single = false;
this.multiple = true
          this.bindingmultiplecustomdates(data.result);
        }
        else{
          this.Single = false;
          this.multiple = false;

          this.showalert = false;

          // setTimeout(() => {
          //   this.showalert = true;
          // }, 3000);
        }

      }
    })
  }

  confignumber:any;

  bindingmultiplecustomdates(data) {
    var res = Math.max.apply(Math, data.map(function (a) { return a.bayconfig; }))

    //alert('Max y = ' + res);
    this.confignumber = res;
    this.configurebasedonNo();
    setTimeout(() => {
      this.bindingmultiplevehicles(data)
    }, 2000);

  }


  configurebasedonNo() {
    debugger

    this.iterations = [];
    var no = +this.confignumber;

    for (let i = 1; i <= no; i++) {
      this.iterations.push(
        { iterrations: i }
      )
    }
  }



  bindingmultiplevehicles(data) {
    debugger

    var no = +this.confignumber;

   

    for (let t = 0; t < data.length; t++) {

      (document.getElementById('vehicleno' + (data[t].bayconfig)) as HTMLInputElement).value = data[t].vrm;


      var endate = new Date(data[t].endDate)
      var startdate = new Date(data[t].startDate)
      var diff = endate.getHours() - startdate.getHours()
      var loopcount = diff + startdate.getHours();
      console.log(diff)
      if (loopcount > 0) {
        for (let c = startdate.getHours(); c <= loopcount; c++) {
          this.selectingcolors(data[t].bayconfig, c)
        }
      }


    }


  }


  selectingcolors(iiteration, id) {
    debugger
    var no = +this.confignumber;

    for (let i = 1; i <= no; i++) {
      if (i == iiteration) {
        var data = document.getElementById('spn' + id + '' + i).style.backgroundColor
        if (data == 'grey') {

        }
        else if (data == 'gold') {
          for (let j = 1; j <= no; j++) {
            document.getElementById('spn' + id + '' + j).style.backgroundColor = 'white';
          }
        }
        else {
          document.getElementById('spn' + id + '' + i).style.backgroundColor = 'gold';
          for (let k = 1; k <= no; k++) {
            if (k == iiteration) {

            }
            else {
              document.getElementById('spn' + id + '' + k).style.backgroundColor = 'grey';
            }
          }
        }
      }
      else {
        var data = document.getElementById('spn' + id + '' + i).style.backgroundColor

        if (data == 'gold' || data == 'white') {

        }
        else {
          document.getElementById('spn' + id + '' + i).style.backgroundColor = 'grey';

        }

      }

    }

  }


  profilepath:any;
  baseurl:any;
  Name
  email
  phno
  startdate;
  enddate

  GetProfile(){
    debugger
    this.showdatepicker=false;
    this.Single=false;
    this.multiple=false;
    //var element = document.getElementById("loader") as HTMLDivElement;
  //  element.style.display = 'block';
    this.authService.GetProfileById(this.bayid.registerUserId).subscribe((data: any) => {
        debugger;
        if (data.status == "200") {

          if(data.result!=null)
          {

console.log(data.result);
  //element.style.display = 'none';
  this.Name=data.result.firstName+' '+data.result.lastName;
  this.email=data.result.email;
  this.phno=data.result.mobileNumber;
  var baseurl=this.authService.baseUrl;
  // if(baseurl=="http://localhost:53846/api/"){
  //         baseurl="http://localhost:53846/";
  //   }
  // this.baseurl="http://smartpermitapi.eisappserver.net"
  this.profilepath=baseurl+data.result.profilePath;
  this.startdate=data.result.baysConfig[0].startDate;
  this.enddate=data.result.baysConfig[0].endDate;

  if(data.result.profilePath==null){
     this.profilepath="assets/img/person-48-primary.png";
  }


  this.authService.getvehiclestimedetails(this.bayid.registerUserId.toString(), this.bayid.id.toString()).subscribe((data: any) => {
    if (data.status == "200") {
      if(data.result != null)
      {
        this.showdatepicker=true;
     
        for (let i = 0; i < this.events.length; i++) {
          this.events.splice(i, this.events.length);
        }
        
        if (data.result.message == "mutilpledata") {
  
          for (let i = 0; i < data.result.data.length; i++) {
            if (data.result.data[i][0] != undefined) {
              for (let k = 0; k < data.result.data[i][0].selectedddates.length; k++) {
  
  
                this.addEvent(data.result.data[i][0].selectedddates[k].fromDate);
  
                //this.onValueChange1(new Date(data.result.data[i][0].selectedddates[k].fromDate))
              }
            }
  
          }
  
          // this.bindingmultiplecustomdates(data.result.data[0]);
        }
        else
        {
  
            if (data.result[0] != null) {
              for (let k = 0; k < data.result[0].selectedddates.length; k++) {
                this.addEvent(data.result[0].selectedddates[k].fromDate);
  
               // this.onValueChange1(new Date(data.result[0].selectedddates[k].fromDate))
              }
          }
  
  
        }
      }
     
    }
  })

          }
          
        }
        else {
         
        }

    })
}

dateSelected = [];
selectedClass = [];
//  onValueChange1(event) {

//     if (event.length === undefined) {
//       const date = this.getDateItem(event);

//       const index = this.dateSelected.findIndex(item => {
//         const testDate = this.getDateItem(item);
//         return testDate === date;
//       });

//       console.log('Date', date, index);

//       if (index < 0) {
//         this.dateSelected.push(event);
//       }
//       else {
//         this.dateSelected.splice(index, 1);
//       }
//     }


//     if (this.dateSelected.length > 0) {
//       this.selectedClass = this.dateSelected.map(date => {
//         return {
//           date,
//           classes: ['custom-selected-date']
//         }
//       })
//     }
//   }


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

}

