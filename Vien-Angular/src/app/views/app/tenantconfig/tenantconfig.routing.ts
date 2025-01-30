import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantConfigComponent } from './tenantconfig.component';
import { EditTenantComponent } from './edittenant/edittenant.component';
import { AddTenantComponent } from './addtenant/addtenant.component';
import { TenantComponent } from './tenant/tenant.component';
import{BulkUploadComponent} from './bulkupload/bulkupload.component';
const routes: Routes = [
    {
        path: '', component: TenantConfigComponent,
        children: [
            { path: '', redirectTo: 'tenant', pathMatch: 'full' },
            { path: 'tenant', component: TenantComponent },
           { path: 'addtenant', component: AddTenantComponent },
           { path: 'edittenant/:id/:value', component: EditTenantComponent },
           { path: 'bulkupload', component: BulkUploadComponent },
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
export class TenantConfigRoutingModule { }
