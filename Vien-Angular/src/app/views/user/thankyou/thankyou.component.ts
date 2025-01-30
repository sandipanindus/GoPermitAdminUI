import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private approute: ActivatedRoute) { }
  success1: string;
  success2: string;
  success3: string;
  ngOnInit(): void {
    var element=document.getElementById("loading") as HTMLDivElement;
    element.style.display='block';
    var status = this.approute.snapshot.queryParamMap.get('status')
    if (status == "register") {
      this.success1 = "User registered successfully";
      this.success2 = "Please check your email";
      this.success3 = "for further instructions on how to complete your account setup.";
    }
    else if (status == "forget") {
      this.success1 = "Mail sent successfully";
      this.success2 = "Please check your email";
      this.success3 = "for reset password link";
    }
    else if (status == "reset") {
      this.success1 = "Password changed successfully";
      this.success2 = "Please login here";
      this.success3 = "to continue";
    }
    else if (status == "set") {
      this.success1 = "Password generated successfully";
      this.success2 = "Please login here";
      this.success3 = "to continue";
    }
    element.style.display='none';
  }


}
