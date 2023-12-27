import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MapComponent } from './map/map.component';
import { ConfirmDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatCardModule} from '@angular/material/card'; 

@NgModule({
    declarations: [
        MapComponent,
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatCardModule
    ],
    exports: [
        MapComponent,
        ConfirmDialogComponent
    ]
})
export class SharedModule { }
