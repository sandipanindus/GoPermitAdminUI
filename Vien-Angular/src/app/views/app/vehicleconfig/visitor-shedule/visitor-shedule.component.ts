import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input, ElementRef, Renderer2 } from '@angular/core';
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

@ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
@ViewChild('dialogContainer', { static: false }) dialogContainer!: ElementRef;
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


  constructor(private spinner: NgxSpinnerService,private authService: AuthService,private modalService: BsModalService,
    private renderer: Renderer2
  ) { 
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
 selectedDate
eventClicked(data)
{
   debugger
   //this.selectedDate=data.date
   this.selectedDate = new Date(data.date)
  this.spinner.show();
this.showtable=false;

  this.authService.Getvistorbysitedate(this.siteId, this.getDateItem(data.date)).subscribe((result: any) => {
    const finalresult = JSON.parse(result);
    if(finalresult.message === 'Success') {
      this.Visitordetails = finalresult.result;
      console.log("VisitorDetails",this.Visitordetails)
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

showDialog: boolean = false;

  //calendar

  /**
   * table assign values
   * vrm no and time
   */


  assigntoTable1() {
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

     assigntoTable() {
      debugger
      for (let i = 0; i < this.Visitordetails.length; i++) {
        for (let j = 0; j < this.Visitordetails[i].result.length; j++) {
          const result = this.Visitordetails[i].result[j];
    
          const startDate = new Date(result.startDate);
          const endDate = new Date(result.endDate);
    
          const startHour = startDate.getHours();
          const endHour = endDate.getHours();
    
          for (let hour = startHour; hour <= endHour; hour++) {
            const cellId = `${hour}-${this.Visitordetails[i].id}`;
            const cell = document.getElementById(cellId);
    
            if (cell) {
              const slot = document.createElement('p');
              slot.className = `slot cls${result.id}`;
              slot.id = `${result.id}-${hour}`;
              slot.innerHTML = `${result.vrmNumber}<br>`;
              slot.style.background = 'gold';
              slot.style.borderRadius = '4px';
              slot.style.textAlign = 'center';
              slot.style.marginBottom = '0px';
              slot.style.padding = '5px';
              slot.style.cursor = 'pointer';
    
              // Append slot to the cell
              cell.appendChild(slot);
    
              // ✅ Trigger testing() with the correct ID on hover
              slot.addEventListener('mouseenter', (event) => {
                const elementId = `${result.id}`;  // Extract the ID
                this.testing(elementId);           // Call testing with the ID
              });
    
              slot.addEventListener('mouseleave', () => this.hideDialog());
            }
          }
        }
      }
    }
    
// assigntoTable() {
//   debugger;
//   const selectedDate = new Date(this.selectedDate); // e.g., 2025-07-01
//   const selectedDateStr = selectedDate.toDateString(); // for comparison

//   for (let i = 0; i < this.Visitordetails.length; i++) {
//     const visitor = this.Visitordetails[i];

//     for (let j = 0; j < visitor.result.length; j++) {
//       const result = visitor.result[j];

//       const startDate = new Date(result.startDate);
//       const endDate = new Date(result.endDate);

//       // Loop from start hour to end hour, but filtered by selected date
//       let current = new Date(startDate);
//       current.setMinutes(0, 0, 0); // normalize minutes

//       while (current <= endDate) {
//         const currentDateStr = current.toDateString();

//         if (currentDateStr === selectedDateStr) {
//           const hour = current.getHours();
//           const cellId = `${hour}-${visitor.id}`;
//          // const cellId = `${hour}-${this.Visitordetails[i].id}`;

//           const cell = document.getElementById(cellId);
//           if (!cell) {
//             console.warn(`❌ Cell not found: ${cellId}`);
//           } else {
//             if (!document.getElementById(`${result.id}-${hour}`)) {
//               const slot = document.createElement('p');
//               slot.className = `slot cls${result.id}`;
//               slot.id = `${result.id}-${hour}`;
//               slot.innerHTML = `${result.vrmNumber}<br>`;
//               slot.style.background = 'gold';
//               slot.style.borderRadius = '4px';
//               slot.style.textAlign = 'center';
//               slot.style.marginBottom = '0px';
//               slot.style.padding = '5px';
//               slot.style.cursor = 'pointer';

//               cell.appendChild(slot);

//               slot.addEventListener('mouseenter', () => {
//                 this.testing(result.id.toString());
//               });

//               slot.addEventListener('mouseleave', () => this.hideDialog());
//             }
//           }
//         }

//         current.setHours(current.getHours() + 1);
//       }
//     }
//   }
// }





  showDialogOnHover(event: MouseEvent, details: any) {
    this.details = [details];
    this.showDialog = true;

    const dialogEl = this.dialogContainer.nativeElement;
    const offsetX = 10; // Add some offset
    const offsetY = 10;

    // Set the position of the dialog near the hovered element
    this.renderer.setStyle(dialogEl, 'top', `${event.clientY + offsetY}px`);
    this.renderer.setStyle(dialogEl, 'left', `${event.clientX + offsetX}px`);
  }

  // Hide the dialog on mouse leave
  hideDialog() {
    this.showDialog = false;
  }
  
  
  
details:any;
count=1;

testing1(id){
  debugger
 var length=this.Visitordetails.length ; 
if(this.count==length)
{
 this.showdetails=false;
 
 this.authService.Getvistordeatilsbyid(id.toElement.id).subscribe((result: any) => {
    ;
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

 testing(id){
   debugger
  var length=this.Visitordetails.length ; 

  this.showdetails=false;
  
  this.authService.Getvistordeatilsbyid(id).subscribe((result: any) => {
     ;
    var finalresult = JSON.parse(result);
    if (finalresult.status == "200") {
      console.log(finalresult);
      this.showdetails=true;
      this.count=1;

     this.details=finalresult.result;

     // this.openModal(this.model)
    }

  })


// else
// {
//   this.count++;
// }


   
  //var name =(document.getElementById('20-1380') as HTMLInputElement).name;

   
 }




  GetSites() {
    this.authService.GetSitesbylogin(this.loginid).subscribe((result: any) => {
         ;
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
    });this.assigntoTable();
}

// Getbaybysite() {
//    debugger
//   for (let i = 0; i < this.events.length; i++) {
//     this.events.splice(i, this.events.length);
//   }
//   this.authService.Getvistordeatilsbysite(this.siteId).subscribe((result: any) => {
//     const responce = JSON.parse(result);
//     console.log(responce);
//     if (responce.status === "200") {
//       this.showdatepicker=true;
//       if (responce.result.length > 0) {
//         for (let k = 0; k < responce.result.length; k++) {
//           this.showtable=false;
//           this.showdatepicker=true;
//          var filterdateforbublelist= this.filtergriddata(responce.result[k].startDate);

//          if (filterdateforbublelist.length == 0) {
//           this.addEvent(responce.result[k].startDate);

//          }
//          // this.onValueChange1(new Date(data.result[0].selectedddates[k].fromDate))
//         }
//       }
//       else
//       {
//         this.showtable=false;
//           this.showdatepicker=false;
//            this.showdetails=false;

//       }
//     }
//   });
 
// }


Getbaybysite() {
  debugger
  this.events = [];

  this.authService.Getvistordeatilsbysite(this.siteId).subscribe((result: any) => {
    const response = JSON.parse(result);

    if (response.status === "200") {
      this.showdatepicker = true;

      if (response.result.length > 0) {
        this.showtable = false;

        for (let entry of response.result) {
          const start = new Date(entry.startDate);
          const end = new Date(entry.endDate);

          const sameDay = start.toDateString() === end.toDateString();

          if (sameDay) {
            // Same-day event: use original times
            this.addEvent(start, end);
          } else {
            // Split into 2 events

            // Day 1: From start time to 23:59:59
            const endOfDay = new Date(start);
            endOfDay.setHours(23, 59, 59, 999);
            this.addEvent(start, endOfDay);

            // Day 2: From 00:00 to end time
            const startOfNext = new Date(end);
            startOfNext.setHours(0, 0, 0, 0);
            this.addEvent(startOfNext, end);
          }
        }
      } else {
        this.showtable = false;
        this.showdatepicker = false;
        this.showdetails = false;
      }
    }
  });
}


// addEvent(date): void {
//   this.events = [
//     ...this.events,
//     {
//       start: addDays(new Date(date), 0),
//                 title: 'Date Configured',
//                 color: colors.color2
//     }
//   ];
// }

addEvent(start: Date, end: Date): void {
  this.events = [
    ...this.events,
    {
      start: new Date(start),
      end: new Date(end),
      title: 'Date Configured',
      color: colors.color2
    }
  ];
}

filtergriddata(serachstring: Date) {
   
  return this.events.filter(X =>
    this.getDateItem(X.start)  == this.getDateItem(new Date(serachstring)));

}

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, {animated: true, class: 'modal-dialog-centered' });
}

decline(): void {

  this.modalRef.hide();
}

hours: string[] = Array.from({ length: 24 }, (_, i) =>
  (i < 10 ? '0' + i : i) + ':00'
);

// getSlotData(hour: string, item: any): any {
//   debugger
//   const targetHour = parseInt(hour.split(':')[0], 10);

//   return item.result.find((res: any) => {
//     const startHour = new Date(res.startDate).getHours();
//     const endHour = new Date(res.endDate).getHours() || 24;

//     return targetHour >= startHour && targetHour < endHour;
//   });
// }

getSlotData(hour: string, item: any): any {
  const targetHour = parseInt(hour.split(':')[0], 10);
  const targetMinute = parseInt(hour.split(':')[1], 10) || 0;

  const targetTime = new Date(this.selectedDate);
  targetTime.setHours(targetHour, targetMinute, 0, 0);

  return item.result.find((res: any) => {
    const start = new Date(res.startDate);
    const end = new Date(res.endDate);

    // Check if selected date is in the range of booking
    const isSameDay =
      targetTime >= start &&
      targetTime < end; // strictly less than end time

    return isSameDay;
  });
}



openDialog(slot: any): void {
  debugger
//  const booking = this.getSlotData(hour, item);
  if (slot) {
    // Call your dialog method here
    this.testing(slot.id);
  }
}



}
