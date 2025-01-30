import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppPropertyComponent } from './appproperty.component';
import { PropertyComponent } from './property/property.component';
import { TenentComponent } from './tenent/tenent.component';
import { VehicleRegistrationComponent } from './vehicleregistration/vehicleregistration.component';
import { ViewPropertyComponent } from './viewproperty/viewproperty.component';
import { ViewTenentComponent } from './viewtenent/viewtenent.component';

const routes: Routes = [
    {
        path: '', component: AppPropertyComponent,
        children: [
            { path: '', redirectTo: 'viewproperty', pathMatch: 'full' },
            { path: 'viewproperty', component: ViewPropertyComponent },
            { path: 'viewtenent', component: ViewTenentComponent },
            { path: 'property', component: PropertyComponent },
            { path: 'tenent', component: TenentComponent },
            { path: 'vehicle-registration', component: VehicleRegistrationComponent },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppPropertyRoutingModule { }
