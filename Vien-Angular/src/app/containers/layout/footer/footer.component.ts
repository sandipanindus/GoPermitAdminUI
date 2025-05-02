import { Component, OnInit } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  date = new Date();
  termsandconditionopen=false;
  privacypolicy=false;
  enduseragreement=false;

  constructor() { }

  ngOnInit() {
  }

  openModal() {
    this.termsandconditionopen=true
  }

  openModal2() {
    this.privacypolicy=true
  }

 openModal3(){
  this.enduseragreement=true
 }

}


