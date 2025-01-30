import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService, ISidebar } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { LangService, Language } from 'src/app/shared/lang.service';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html'
})
export class TopnavComponent implements OnInit, OnDestroy {
  sidebar: ISidebar;
  subscription: Subscription;
  displayName = 'Sarah Cortney';
  languages: Language[];
  currentLanguage: string;
  isSingleLang;
  isFullScreen = false;
  isDarkModeActive = false;
  searchKey = '';
  totalcount = 0;
  profilepath: string;
  supports: any = [];
  baseurl: any;
  constructor(private sidebarService: SidebarService, private authService: AuthService, private router: Router, private langService: LangService) {
    this.languages = this.langService.supportedLanguages;
    this.currentLanguage = this.langService.languageShorthand;
    this.isSingleLang = this.langService.isSingleLang;
    this.isDarkModeActive = this.getColor().indexOf('dark') > -1 ? true : false;
  }

  onDarkModeChange(event) {
    let color = this.getColor();
    if (color.indexOf('dark') > -1) {
      color = color.replace('dark', 'light');
    } else if (color.indexOf('light') > -1) {
      color = color.replace('light', 'dark');
    }
    localStorage.setItem(environment.themeColorStorageKey, color);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  getColor() {
    return localStorage.getItem(environment.themeColorStorageKey)
      ? localStorage.getItem(environment.themeColorStorageKey)
      : environment.defaultColor;
  }

  fullScreenClick() {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onLanguageChange(lang) {
    this.langService.language = lang.code;
    this.currentLanguage = this.langService.languageShorthand;
  }

  ngOnInit() {
    var id = localStorage.getItem("LoginId");
    var firstname = localStorage.getItem("firstname");
    var lastname = localStorage.getItem('lastname');
    if (id != null) {
      this.displayName = firstname + " " + lastname;
    }
    if (this.authService.user) {

    }
    debugger;
    var profile = localStorage.getItem("ProfilePath");
    if (profile == "null") {
      this.profilepath = "/assets/img/profile-pic-l.jpg";
    }
    else {
       this.baseurl= this.authService.baseUrl;
      if(this.baseurl=="http://localhost:53846/"){
        this.baseurl="http://localhost:53846"
    }
    if(this.baseurl=="http://smartpermitapi.fadelsoft.com/"){
      this.baseurl="http://smartpermitapi.fadelsoft.com"
    }
    if(this.baseurl=="https://api.gopermit.co.uk/"){
      this.baseurl="https://api.gopermit.co.uk"
    }
      this.profilepath = this.baseurl+localStorage.getItem("ProfilePath");
    }

    this.subscription = this.sidebarService.getSidebar().subscribe(
      res => {
        this.sidebar = res;
      },
      err => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.GetNotificationsList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  menuButtonClick = (e: { stopPropagation: () => void; }, menuClickCount: number, containerClassnames: string) => {
    if (e) { e.stopPropagation(); }

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  }
  GetNotificationsList() {
    debugger;
    var SiteId = localStorage.getItem("SiteId");
    var RoleId = localStorage.getItem("RoleId");
    var LoginId = localStorage.getItem("LoginId");

    this.authService.GetisReadNotifications(RoleId, LoginId, SiteId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      debugger
      if (finalresult.status == "200") {
        this.supports = finalresult.result;
        this.supports.ProfilePath=this.baseurl+this.supports[0].profilePath
        this.totalcount = this.supports.length;
      }
      else {

        // this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

      }
    });
  }
  mobileMenuButtonClick = (event: { stopPropagation: () => void; }, containerClassnames: string) => {
    if (event) { event.stopPropagation(); }
    this.sidebarService.clickOnMobileMenu(containerClassnames);
  }
  EditProfile() {
    debugger;
    var value = "edit";
    var id = localStorage.getItem("LoginId");

    this.router.navigate(['app/userconfig/edituser/' + id + '/' + value]);
  }
  onSignOut() {
    localStorage.setItem("LoginId", null);
    localStorage.setItem("firstname", null);
    localStorage.setItem("lastname", null);
    localStorage.setItem("organisationame", null);
    localStorage.setItem("email", null);
    localStorage.setItem("subdomain", null);
    localStorage.setItem("SiteId", null);
    localStorage.setItem("RoleId", null);
    localStorage.setItem("ProfilePath", null);
    this.router.navigateByUrl('user/login');

  }
  OpenNotification(id, ticketId) {
    var value = "edit";
    localStorage.setItem("ticketid", ticketId);
    this.router.navigateByUrl('app/siteconfig/editsupport/' + id + '/' + value);
  }
  Notification() {
    debugger
    // var value = "edit";
    // localStorage.setItem("ticketid", ticketId);
    this.router.navigateByUrl('app/siteconfig/support');
  }
  searchKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    } else if (event.key === 'Escape') {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) { input.classList.remove('mobile-view'); }
      this.searchKey = '';
    }
  }

  searchAreaClick(event) {
    event.stopPropagation();
  }
  searchClick(event) {
    if (window.innerWidth < environment.menuHiddenBreakpoint) {
      let elem = event.target;
      if (!event.target.classList.contains('search')) {
        if (event.target.parentElement.classList.contains('search')) {
          elem = event.target.parentElement;
        } else if (
          event.target.parentElement.parentElement.classList.contains('search')
        ) {
          elem = event.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains('mobile-view')) {
        this.search();
        elem.classList.remove('mobile-view');
      } else {
        elem.classList.add('mobile-view');
      }
    } else {
      this.search();
    }
    event.stopPropagation();
  }

  search() {
    if (this.searchKey && this.searchKey.length > 1) {
      this.router.navigate(['/app/pages/miscellaneous/search'], { queryParams: { key: this.searchKey.toLowerCase().trim() } });
      this.searchKey = '';
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event) {
    const input = document.querySelector('.mobile-view');
    if (input && input.classList) { input.classList.remove('mobile-view'); }
    this.searchKey = '';
  }
}
