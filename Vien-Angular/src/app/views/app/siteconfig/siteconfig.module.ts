import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteConfigComponent } from './siteconfig.component';
import { SiteConfigRoutingModule } from './siteconfig.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';
import { UserConfigContainersModule } from 'src/app/containers/userconfig/userconfig.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AddSiteComponent } from './addsite/addsite.component';
import {EditSiteComponent} from './editsite/editsite.component';
import {SiteComponent} from './site/site.component';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { UiCardsContainersModule } from 'src/app/containers/ui/cards/ui.cards.containers.module';
import { UiModalsContainersModule } from 'src/app/containers/ui/modals/ui.modals.containers.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SupportComponent} from './support/support.component';
import {EditSupportComponent} from './editsupport/editsupport.component';
import { ZatparkComponent } from './zatparklog/zatparklog.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AuditComponent } from './auditlog/auditlog.component';
@NgModule({
    declarations: [
        AddSiteComponent,
        EditSiteComponent,
        SiteComponent,
        SiteConfigComponent,
        SupportComponent,
        EditSupportComponent,
        ZatparkComponent,
        AuditComponent
    ],
    imports: [
        NgxSpinnerModule,
        UiModalsContainersModule,
        UiCardsContainersModule,
        BootstrapModule,
        ComponentsStateButtonModule,
        CommonModule,
        SharedModule,
        FormsModule,
        SiteConfigRoutingModule,
        LayoutContainersModule,
        UserConfigContainersModule,
        ComponentsChartModule,
        SortablejsModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        PagesContainersModule,
        PaginationModule.forRoot(),
        HotkeyModule.forRoot(),
        CollapseModule.forRoot(),
        TabsModule.forRoot(),
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        SimpleNotificationsModule.forRoot(),
        BsDatepickerModule.forRoot()

    ]
})
export class SiteConfigModule { }
