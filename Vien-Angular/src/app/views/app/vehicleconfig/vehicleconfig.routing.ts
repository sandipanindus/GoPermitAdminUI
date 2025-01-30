import { VisitorSheduleComponent } from './visitor-shedule/visitor-shedule.component';
import { ParkingSheduleComponent } from './parking-shedule/parking-shedule.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleConfigComponent } from './vehicleconfig.component';
import { AddVehicleRegistrationComponent } from './addvehicleregistration/addvehicleregistration.component';
import {EditVehicleRegistrationComponent} from './editvehicleregistration/editvehicleregistration.component';
import {VehicleRegistrationComponent} from './vehicleregistration/vehicleregistration.component';

const routes: Routes = [
    {
        path: '', component: VehicleConfigComponent,
        children: [
            { path: '', redirectTo: 'vehicleregistration', pathMatch: 'full' },
            { path: 'vehicleregistration', component: VehicleRegistrationComponent },
            { path: 'addvehicleregistration', component: AddVehicleRegistrationComponent },
           { path: 'editvehicleregistration/:id/:value', component: EditVehicleRegistrationComponent },
           { path: 'ParkingShedule', component: ParkingSheduleComponent },
           { path: 'visitorShedule', component: VisitorSheduleComponent },
         //   { path: 'datatype', component: DatatypeComponent },
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
export class VehicleConfigRoutingModule { }
