import { Component, TemplateRef, OnInit, ViewChild, OnDestroy, Injectable, Input, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChatService, IChatContact, IChatConversation } from '../../applications/chat/chat.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-editsupport',
    templateUrl: './editsupport.component.html'
})
export class EditSupportComponent implements OnInit, OnDestroy {
    @ViewChild('scroll') scrollRef: PerfectScrollbarComponent;

    contacts: IChatContact[];
    conversations: IChatConversation[];
    currentUserId = 1;
    chats: any = [];
    selectedConversation: IChatConversation;

    contacts$: Observable<IChatContact[]>;

    searchTerms = new Subject<string>();
    searchKeyword = '';
    message = '';
    parentid:number;
    ticketid:number;
    supportsubmitted = false;
    sitename: string;
    supportForm: FormGroup;
    name: string;
    email: string;
    subject: string;
    issue: string;
    response: string;
    registeruserid: number;
    SupportId: any;
    @Input() currentState = '';
    buttonDisabled = false;
    buttonState = '';
    
    constructor(private translate: TranslateService,private chatService: ChatService, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2,
        private spinner: NgxSpinnerService, private approute: ActivatedRoute, private modalService: BsModalService, private formBuilder: FormBuilder,
        private authService: AuthService, private notifications: NotificationsService, private router: Router) {
        this.supportForm = this.formBuilder.group({
            dresponse: ['', Validators.required]
        });

    }
    get r() { return this.supportForm.controls; }


    ngOnInit() {
        debugger;
    this.agent=this.getBrowserName();

        var id = this.approute.snapshot.params['id']
        var value = this.approute.snapshot.params['value']
       // this.Edit(id);
        this.renderer.addClass(document.body, 'no-footer');
        var ticketId=localStorage.getItem("ticketid");
        this.getchats(ticketId);



       // this.getContacts();

        // this.contacts$ = this.searchTerms.pipe(
        //     debounceTime(300),
        //     distinctUntilChanged(),
        //     switchMap((term: string) => this.chatService.searchContacts(this.currentUserId, term)),
        // );
    }

    agent

    getBrowserName() {
      const agent = window.navigator.userAgent.toLowerCase()
      switch (true) {
          case agent.indexOf('edge') > -1:
              return 'edge';
          case agent.indexOf('opr') > -1 && !!(<any>window).opr:
              return 'opera';
          case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
              return 'chrome';
          case agent.indexOf('trident') > -1:
              return 'ie';
          case agent.indexOf('firefox') > -1:
              return 'firefox';
          case agent.indexOf('safari') > -1:
              return 'safari';
          default:
              return 'other';
      }
    }
    search(term: string): void {
        this.searchKeyword = term;
        this.searchTerms.next(term);
    }

    getchats(id) {
        this.authService.GetSupportMessages(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            debugger;
            if (finalresult.status == "200") {
                

                this.chats = finalresult.result;
                if (finalresult.result.length > 0) {
                    var length = this.chats.length;
                    this.ticketid=this.chats[0].id;
                    this.subject=this.chats[0].subject;
                    if (this.chats[length - 1].roleId != 1) {

                      //  document.getElementById("messagediv").style.display='block';
                        this.parentid=this.chats[length-1].id;
                        
                    }
                    else{

                        this.parentid=this.chats[length-1].id;
                    }
                    if(this.chats[0].status=="Closed"){
                        document.getElementById("messagediv").style.display='none'; 
                    }
                    else{
                        document.getElementById("messagediv").style.display='block'; 
                    }
                }

            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    getContacts() {
        this.chatService.getContacts()
            .subscribe(contacts => {
                this.contacts = contacts;
                this.getConversations();
            });
    }

    getConversations() {
        this.chatService.getConversations(this.currentUserId)
            .subscribe(conversations => {
                this.conversations = conversations;
                this.selectedConversation = this.conversations[0];
                this.changeDetectorRef.detectChanges();
                if (this.scrollRef) {
                    this.scrollRef.directiveRef.scrollToBottom();
                }
            });
    }
    selectConversation(conversationId: number) {
        this.selectedConversation = this.conversations.find(x => x.id === conversationId);
        if (this.scrollRef) {
            setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
        }
    }


    getOtherUser(users: number[]): IChatContact {
        const otherId = users.find(x => x !== this.currentUserId);
        return this.contacts.find(x => x.id === otherId);
    }
    getUser(id: number): IChatContact {
        if (id === this.currentUserId) {
            return {
                id,
                title: 'Sarah Kortney',
                img: '/assets/img/profile-pic-l.jpg',
                date: '5 minutes ago'
            };
        }
        return this.contacts.find(x => x.id === id);
    }
    onSuccess() {
        this.notifications.create(this.translate.instant('alert.success'), 
        this.translate.instant('Response send successfully'), NotificationType.Success,
         { timeOut: 3000, showProgressBar: true });
      }
    error(msg){
        this.notifications.create(this.translate.instant('alert.error'), 
        this.translate.instant(msg), NotificationType.Error,{
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false
          });
    }
    sendMessage() {
        if (this.message.length > 0) {
            var element = document.getElementById("loading") as HTMLDivElement;
            element.style.display = 'block';
           
            // if(this.message.length<=20){
            //     this.error('require atleast 20 characters');
            //   element.style.display = 'none';
             
            //   return;
            // }
            debugger
           
            var data=({
              tenantId:localStorage.getItem("LoginId"),
              id:this.parentid,
              issue:this.message,
              subject:this.subject,
              ticketId:this.ticketid
            });
            this.authService.UpdateSupport(data).subscribe((data: any) => {
                var result = JSON.parse(data);
              if (result.status == "200") {
                this.onSuccess();
                element.style.display = 'none';
                setTimeout(() => {
                    var ticketId=localStorage.getItem("ticketid");
                    this.getchats(ticketId);
                    this.message='';
                  }, 1000);
        
              }
              else {
                element.style.display = 'none';
                //this.error('');
              }
        
            })
          
            // const time = this.getCurrentTime();
            // this.selectedConversation.messages.push({ sender: this.currentUserId, text: this.message, time });
            // this.selectedConversation.lastMessageTime = time;
            // if (this.scrollRef) {
            //     setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
            // }
            // this.message = '';
        }
        else{
            this.error('message is required');
        }
    }

    messageInputKeyUp(event: KeyboardEvent) {
        if (event.key === 'Enter') { this.sendMessage(); }
    }

    getCurrentTime(): string {
        const now = new Date();
        return this.pad(now.getHours(), 2) + ':' + this.pad(now.getMinutes(), 2);
    }

    pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    canceladdsupport() {
        this.router.navigateByUrl('app/siteconfig/support');
    }
    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'no-footer');
    }
    Edit(id: any) {
        // if (value == "view") {
        //     (document.getElementById("txtname") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtissue") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtsubject") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtresponse") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtsitename") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
        // }
        // else {
        //     (document.getElementById("txtname") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtemail") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtissue") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtsitename") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtsubject") as HTMLInputElement).disabled = true;
        //     (document.getElementById("txtresponse") as HTMLInputElement).disabled = false;
        //     (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
        // }
        this.SupportId = id;
        this.authService.GetSupportById(id).subscribe((result: any) => {
            var finalresult = JSON.parse(result);
            debugger;
            if (finalresult.status == "200") {
                this.name = finalresult.result.name;
                this.email = finalresult.result.email;
                this.subject = finalresult.result.subject;
                this.issue = finalresult.result.issue;
                this.sitename = finalresult.result.propertyName;
                this.response = finalresult.result.response;
                this.registeruserid = finalresult.result.registerUserId;
                // if (value == "edit") {
                //     if (this.response == null) {
                //         (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = false;
                //         (document.getElementById("txtresponse") as HTMLInputElement).disabled = false;
                //     }
                //     else {
                //         (document.getElementById("txtsubmit") as HTMLButtonElement).disabled = true;
                //         (document.getElementById("txtresponse") as HTMLInputElement).disabled = true;
                //     }
                // }
            }
            else {
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        });
    }
    spinnerload() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 1000);
    }

    ngAfterViewInit(): void {
        this.spinnerload();
    }
    UpdateSupport() {
        var element = document.getElementById("loading") as HTMLDivElement;
        element.style.display = 'block';
        this.supportsubmitted = true;
        if (this.supportForm.invalid) {
            if (this.response == undefined || this.response == null || this.response == "") {
                document.getElementById("txtresponse").className = "invalid-color";
            }
            element.style.display = 'none';
            return;
        }

        
    var objreq={
        Agent:this.agent,
        RegisterUserId:parseInt(localStorage.getItem("LoginId")),
         RoleId:localStorage.getItem("RoleId"),
        Operation:"update supports details",
        Function:"update supports tenants"
      }
          this.authService.Saveauditlog(objreq).subscribe((respone: any) => {
      
          })
        var data = {
            Response: this.response,
            Subject: this.subject,
            RegisterUserId: this.registeruserid,
            Issue: this.issue,
            Name: this.name,
            Email: this.email,
            Id: parseInt(this.SupportId)
        }
        this.authService.UpdateSupport(data).subscribe((data: any) => {

            var result = JSON.parse(data);
            debugger;
            if (result.status == "200") {
                element.style.display = 'none';
                this.notifications.success('Success', "Suppport response created Successfully", NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: false, clickToClose: true });

                setTimeout(() => {
                    this.router.navigate(['app/siteconfig/support']);
                }, 1000);
            }
            else {
                element.style.display = 'none';
                this.notifications.alert('Alert', result.message, NotificationType.Alert, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });
            }
        }, (error) => {
            element.style.display = 'none';
            this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 2000, showProgressBar: false });

        });
    }

}