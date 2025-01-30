import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddNewRoleModalComponent } from './add-new-role-modal/add-new-role-modal.component';
import { EditRoleModalComponent } from './edit-role-modal/edit-role-modal.component';
import { AddNewUserModalComponent } from './add-new-user-modal/add-new-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutContainersModule } from '../layout/layout.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
@NgModule({
  declarations: [
    AddNewRoleModalComponent,
    EditRoleModalComponent,
    AddNewUserModalComponent,
    EditUserModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutContainersModule,
    NgSelectModule,
    SortablejsModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [
    AddNewRoleModalComponent,
    EditRoleModalComponent,
    AddNewUserModalComponent,
    EditUserModalComponent
  ]
})
export class UserConfigContainersModule { }
