import { Component, OnInit, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { LangService } from './shared/lang.service';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

@Injectable()
export class AppComponent implements OnInit, AfterViewInit {
  isMultiColorActive = environment.isMultiColorActive;
  private inactivityTimeout: any;
  private maxInactivityTime = 45 * 60 * 1000; // 45 minutes

  constructor(private langService: LangService, private renderer: Renderer2,private router: Router ) {

  }

  ngOnInit() {
    debugger
    this.langService.init();
   this.resetInactivityTimer(); // Start the timer on init
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }


  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:scroll')
  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logoutUser();
    }, this.maxInactivityTime);
  }

  logoutUser(): void {
    localStorage.removeItem('userinfo'); // Clear session info
    this.router.navigateByUrl('/'); // Redirect to login/home
  }
  
}
