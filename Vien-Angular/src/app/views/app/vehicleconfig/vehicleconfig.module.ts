import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleConfigComponent } from './vehicleconfig.component';
import { VehicleConfigRoutingModule } from './vehicleconfig.routing';
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
import { AddVehicleRegistrationComponent } from './addvehicleregistration/addvehicleregistration.component';
import {EditVehicleRegistrationComponent} from './editvehicleregistration/editvehicleregistration.component';
import {VehicleRegistrationComponent} from './vehicleregistration/vehicleregistration.component';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { UiCardsContainersModule } from 'src/app/containers/ui/cards/ui.cards.containers.module';
import { UiModalsContainersModule } from 'src/app/containers/ui/modals/ui.modals.containers.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ParkingSheduleComponent } from './parking-shedule/parking-shedule.component';


import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { VisitorSheduleComponent } from './visitor-shedule/visitor-shedule.component';



@NgModule({
    declarations: [
       AddVehicleRegistrationComponent,
       EditVehicleRegistrationComponent,
       VehicleRegistrationComponent,
       VehicleConfigComponent,
       ParkingSheduleComponent,
       VisitorSheduleComponent
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
        VehicleConfigRoutingModule,
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
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        SimpleNotificationsModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
          }),
    ]
})
export class VehicleConfigModule { }
