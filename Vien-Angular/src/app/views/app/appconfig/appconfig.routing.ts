import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConfigComponent } from './appconfig.component';
import { AddDatasourceComponent } from './adddatasource/adddatasource.component';
import { EditDatasourceComponent } from './editdatasource/editdatasource.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { AddDatatypeComponent } from './adddatatype/adddatatype.component';
import { EditDatatypeComponent } from './editdatatype/editdatatype.component';
import { DatatypeComponent } from './datatype/datatype.component';
import { AddAnnotationtypeComponent } from './addannotationtype/addannotationtype.component';
import { EditAnnotationtypeComponent } from './editannotationtype/editannotationtype.component';
import { AnnotationtypeComponent } from './annotationtype/annotationtype.component';
const routes: Routes = [
    {
        path: '', component: AppConfigComponent,
        children: [
            { path: '', redirectTo: 'datasource', pathMatch: 'full' },
            { path: 'datasource', component: DatasourceComponent },
            { path: 'adddatasource', component: AddDatasourceComponent },
            { path: 'editdatasource/:id/:value', component: EditDatasourceComponent },
            { path: 'datatype', component: DatatypeComponent },
            { path: 'adddatatype', component: AddDatatypeComponent },
            { path: 'editdatatype/:id/:value', component: EditDatatypeComponent },
            { path: 'annotationtype', component: AnnotationtypeComponent },
            { path: 'addannotationtype', component: AddAnnotationtypeComponent },
            { path: 'editannotationtype/:id/:value', component: EditAnnotationtypeComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppConfigRoutingModule { }
