import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { AddProjectComponent } from './addproject/addproject.component';
import { EditProjectComponent } from './editproject/editproject.component';
import { LabelClassComponent } from './labelclass/labelclass.component';
import { AddLabelClassComponent } from './addlabelclass/addlabelclass.component';
import { EditLabelClassComponent } from './editlabelclass/editlabelclass.component';
import {ImportDataComponent} from './importdata/importdata.component';
import {AddImportDataComponent} from './addimportdata/addimportdata.component';
import {EditImportDataComponent} from './editimportdata/editimportdata.component';
import {AnnotoriumComponent} from './annotoriums/annotorium.component';
const routes: Routes = [
    {
        path: '', component: ProjectsComponent,
        children: [
            { path: '', redirectTo: 'project', pathMatch: 'full' },
             { path: 'project', component: ProjectComponent },
             { path: 'addproject', component: AddProjectComponent },
             { path: 'editproject/:id/:value', component: EditProjectComponent },
             { path: 'labelclass', component: LabelClassComponent },
             { path: 'editlabelclass/:id/:value', component: EditLabelClassComponent },
             { path: 'addlabelclass', component: AddLabelClassComponent },
             {path:'importdata',component:ImportDataComponent},
             {path:'addimportdata',component:AddImportDataComponent},
             { path: 'editimportdata/:id/:value', component: EditImportDataComponent },
             {path:'annotorium',component:AnnotoriumComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }
