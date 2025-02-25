import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteConfigComponent } from './siteconfig.component';
import { AddSiteComponent } from './addsite/addsite.component';
import {EditSiteComponent} from './editsite/editsite.component';
import {SiteComponent} from './site/site.component';
import {SupportComponent} from './support/support.component';
import {EditSupportComponent} from './editsupport/editsupport.component';
import { ZatparkComponent } from './zatparklog/zatparklog.component';
import { AuditComponent } from './auditlog/auditlog.component';
import { AddsiteuserComponent } from './addsiteuser/addsiteuser.component';
import { SiteusertableComponent } from './siteusertable/siteusertable.component';
import { EditsiteuserComponent } from './editsiteuser/editsiteuser.component';
const routes: Routes = [
    {
        path: '', component: SiteConfigComponent,
        children: [
            { path: '', redirectTo: 'site', pathMatch: 'full' },
            { path: 'site', component: SiteComponent },
            { path: 'addsite', component: AddSiteComponent },
            { path: 'editsite/:id/:value', component: EditSiteComponent },
            { path: 'support', component: SupportComponent },
         //   { path: 'adddatatype', component: AddDatatypeComponent },
            { path: 'editsupport/:id/:value', component: EditSupportComponent },
            { path: 'editsiteuser/:id/:value', component: EditsiteuserComponent },
            { path: 'zatparklog', component: ZatparkComponent },
            { path: 'auditlog', component: AuditComponent },
            { path: 'siteuser', component: SiteusertableComponent },
            { path: 'addsiteuser', component: AddsiteuserComponent }
         //   { path: 'annotationtype', component: AnnotationtypeComponent },
         //   { path: 'addannotationtype', component: AddAnnotationtypeComponent },
          //  { path: 'editannotationtype/:id/:value', component: EditAnnotationtypeComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SiteConfigRoutingModule { }
