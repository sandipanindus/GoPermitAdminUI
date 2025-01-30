import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BlankPageComponent } from './blank-page/blank-page.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboards' },
            { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
           // { path: 'applications', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) },
            { path: 'userconfig', loadChildren: () => import('./userconfig/userconfig.module').then(m => m.UserConfigModule) },
            { path: 'appproperty', loadChildren: () => import('./appproperty/appproperty.module').then(m => m.AppPropertyModule) },
            { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
            { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
           // { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
           // { path: 'blank-page', component: BlankPageComponent },
           { path: 'appconfig', loadChildren: () => import('./appconfig/appconfig.module').then(m => m.AppConfigModule) },
           { path: 'siteconfig', loadChildren: () => import('./siteconfig/siteconfig.module').then(m => m.SiteConfigModule) },
           { path: 'vehicleconfig', loadChildren: () => import('./vehicleconfig/vehicleconfig.module').then(m => m.VehicleConfigModule) },
           { path: 'tenantconfig', loadChildren: () => import('./tenantconfig/tenantconfig.module').then(m => m.TenantConfigModule) },
           { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
           {path:'reportconfig',loadChildren:()=>import('./reportconfig/reportconfig.module').then(m=>m.ReportConfigModule)}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
