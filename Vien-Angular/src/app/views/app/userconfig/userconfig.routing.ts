import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserConfigComponent } from './userconfig.component';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './addrole/addrole.component';
import { UserComponent } from './user/user.component';
import { EditRoleComponent } from './editrole/editrole.component';
import { AddUserComponent } from './adduser/adduser.component';
import { EditUserComponent } from './edituser/edituser.component';
import { RolePermissionComponent } from './rolepermission/rolepermission.component';
import { TeamComponent } from './team/team.component';
import {AddTeamComponent} from './addteam/addteam.component';
import {EditTeamComponent} from './editteam/editteam.component';
import { TestpagingComponent } from './testpaging/testpaging.component';
const routes: Routes = [
    {
        path: '', component: UserConfigComponent,
        children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: 'role', component: RoleComponent },
            { path: 'user', component: UserComponent },
            { path: 'testpaging', component: TestpagingComponent },
            { path: 'addrole', component: AddRoleComponent },
            { path: 'editrole/:id/:value', component: EditRoleComponent },
            { path: 'adduser', component: AddUserComponent },
            { path: 'edituser/:id/:value', component: EditUserComponent },
            { path: 'rolepermission', component: RolePermissionComponent },
            { path: 'team', component: TeamComponent },
            { path: 'addteam', component: AddTeamComponent },
            { path: 'editteam/:id/:value', component: EditTeamComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserConfigRoutingModule { }
