import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportConfigComponent } from './reportconfig.component';
//import {SupportComponent} from './support/support.component';
const routes: Routes = [
    {
        path: '', component: ReportConfigComponent,
        children: [
            { path: '', redirectTo: 'support', pathMatch: 'full' },
       //     { path: 'support', component: SupportComponent },
         //  { path: 'addtenant', component: AddTenantComponent },
         //  { path: 'edittenant/:id/:value', component: EditTenantComponent },
         //  { path: 'bulkupload', component: BulkUploadComponent },
         //   { path: 'adddatatype', component: AddDatatypeComponent },
          //  { path: 'editdatatype/:id/:value', component: EditDatatypeComponent },
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
export class ReportConfigRoutingModule { }
