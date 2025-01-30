import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule, Validator, Validators, } from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';
import { UserConfigContainersModule } from 'src/app/containers/userconfig/userconfig.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { UiCardsContainersModule } from 'src/app/containers/ui/cards/ui.cards.containers.module';
import { UiModalsContainersModule } from 'src/app/containers/ui/modals/ui.modals.containers.module';
import { ProjectComponent } from './project/project.component';
import { AddProjectComponent } from './addproject/addproject.component';
import { EditProjectComponent } from './editproject/editproject.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NouisliderModule } from 'ng2-nouislider';
import { TranslateModule } from '@ngx-translate/core';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsContainersModule } from 'src/app/containers/forms/forms.containers.module';
import { FormValidationsContainersModule } from 'src/app/containers/form-validations/form.validations.containers.module';
import { WizardsContainersModule } from 'src/app/containers/wizard/wizards.containers.module';
import { LabelClassComponent } from './labelclass/labelclass.component';
import { AddLabelClassComponent } from './addlabelclass/addlabelclass.component';
import { EditLabelClassComponent } from './editlabelclass/editlabelclass.component';
import { ImportDataComponent } from './importdata/importdata.component';
import { AddImportDataComponent } from './addimportdata/addimportdata.component';
import { EditImportDataComponent } from './editimportdata/editimportdata.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AnnotoriumComponent } from './annotoriums/annotorium.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularImageAnnotatorModule } from 'angular-image-annotator';
//import { ImageDrawingModule } from 'ngx-image-drawing';
@NgModule({
    declarations:
        [
            ProjectsComponent,
            ProjectComponent,
            AddProjectComponent,
            EditProjectComponent,
            LabelClassComponent,
            AddLabelClassComponent,
            EditLabelClassComponent,
            ImportDataComponent,
            AddImportDataComponent,
            EditImportDataComponent,
            AnnotoriumComponent
        ],
    imports: [
        ContextMenuModule.forRoot({
            useBootstrap4: true,
        }),
       //ImageDrawingModule,
        AngularImageAnnotatorModule,
        ImageCropperModule,
        NgxSpinnerModule,
        WizardsContainersModule,
        FormValidationsContainersModule,
        FormsContainersModule,
        RatingModule,
        TranslateModule,
        NouisliderModule,
        DropzoneModule,
        TimepickerModule,
        BsDatepickerModule,
        NgSelectModule,
        CommonModule,
        UiModalsContainersModule,
        SharedModule,
        FormsModule,
        ProjectsRoutingModule,
        LayoutContainersModule,
        BootstrapModule,
        UserConfigContainersModule,
        ComponentsStateButtonModule,
        ComponentsChartModule,
        SortablejsModule,
        UiCardsContainersModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        PagesContainersModule,
        PaginationModule.forRoot(),
        HotkeyModule.forRoot(),
        CollapseModule.forRoot(),
        TabsModule.forRoot(),
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        SimpleNotificationsModule.forRoot(),

    ]
    // providers: [ ConfirmationDialogService ],
    // entryComponents: [ ConfirmationDialogComponent ],
})
export class ProjectsModule { }
