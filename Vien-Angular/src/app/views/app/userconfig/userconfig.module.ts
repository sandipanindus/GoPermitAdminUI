import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserConfigComponent } from './userconfig.component';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './addrole/addrole.component';
import { EditRoleComponent } from './editrole/editrole.component';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './adduser/adduser.component';
import { EditUserComponent } from './edituser/edituser.component';
import { UserConfigRoutingModule } from './userconfig.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule, Validator, Validators, } from '@angular/forms';
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
import { RolePermissionComponent } from './rolepermission/rolepermission.component';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { UiCardsContainersModule } from 'src/app/containers/ui/cards/ui.cards.containers.module';
import { UiModalsContainersModule } from 'src/app/containers/ui/modals/ui.modals.containers.module';
import { TeamComponent } from './team/team.component';
import {AddTeamComponent} from './addteam/addteam.component';
import {EditTeamComponent} from './editteam/editteam.component';
import {NgxSpinnerModule } from 'ngx-spinner';
import { TestpagingComponent } from './testpaging/testpaging.component';
//import{NgMultiSelectDropDownModule}from 'ng-multiselect-dropdown';

@NgModule({
  declarations:
    [
      TestpagingComponent,
      UserConfigComponent,
      RolePermissionComponent,
      EditUserComponent,
      RoleComponent,
      UserComponent,
      AddRoleComponent,
      EditRoleComponent,
      AddUserComponent,
      TeamComponent,
      AddTeamComponent,
      EditTeamComponent
    ],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    UiModalsContainersModule,
    SharedModule,
    FormsModule,
    UserConfigRoutingModule,
    LayoutContainersModule,
    BootstrapModule,
    UserConfigContainersModule,
    ComponentsStateButtonModule,
    ComponentsChartModule,
    SortablejsModule,
    UiCardsContainersModule,
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
    //NgMultiSelectDropDownModule,

  ]
  // providers: [ ConfirmationDialogService ],
  // entryComponents: [ ConfirmationDialogComponent ],
})
export class UserConfigModule { }
