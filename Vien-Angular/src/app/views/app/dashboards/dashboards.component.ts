import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html'
})
export class DashboardsComponent implements OnInit {

  constructor(private spinner:NgxSpinnerService) { }

  ngOnInit() {
   
  }

}
