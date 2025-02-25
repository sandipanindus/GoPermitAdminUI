import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddnewoperatoruserComponent } from './addnewoperatoruser/addnewoperatoruser.component';
import { AddnewoperatordetailComponent } from './addnewoperatordetail/addnewoperatordetail.component';
import { OperatotConfigComponent } from './addnewoperatoruser/operatorconfig.component';
import { OperatordetailstableComponent } from './operatordetailstable/operatordetailstable.component';
import { EditoperatordetailComponent } from './editoperatordetail/editoperatordetail.component';
import { OperatorusertableComponent } from './operatorusertable/operatorusertable.component';
import { EditoperatoruserComponent } from './editoperatoruser/editoperatoruser.component';


const routes: Routes = [
    {
       path: '', component: OperatotConfigComponent ,
        children: [
             { path: '', redirectTo: 'operatordetail', pathMatch: 'full' },
            { path: 'operatordetail', component: OperatordetailstableComponent },
            { path: 'editoperatordetail/:id/:value', component: EditoperatordetailComponent },
            { path: 'editoperatoruser/:id/:value', component: EditoperatoruserComponent },
            { path: 'operatoruser', component: OperatorusertableComponent },
            { path: 'addoperatoruser', component: AddnewoperatoruserComponent },
            { path: 'addoperatordetails', component: AddnewoperatordetailComponent },
   
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorconfigRoutingModule { }
