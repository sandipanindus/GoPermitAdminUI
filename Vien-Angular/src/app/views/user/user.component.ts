import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2,private authService: AuthService,private notifications: NotificationsService) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'background');
    this.renderer.addClass(document.body, 'no-footer');
    debugger;
    var data={
      UserName:"admin",
      Password:"labelpad"
    }
    this.authService.Gettoken(data).subscribe((result:any) => {
      localStorage.setItem("token",result);
      
      this.authService.GetValue().subscribe((result:any)=>{
        debugger;
      })

    //   this.notifications.success('Success',"Success",NotificationType.Success,{ theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
    // }, (error) => {
    //   this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
     
    });
   // localStorage.setItem("hello")='';
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'background');
    this.renderer.removeClass(document.body, 'no-footer');
  }
}
