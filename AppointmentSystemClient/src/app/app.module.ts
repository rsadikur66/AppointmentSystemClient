import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { HttpClientModule } from '@angular/common/http';
// Angular Material modules
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';  // ✅ correct import
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'; // এই line টি যোগ করুন

@NgModule({
  declarations: [
    AppComponent,
    AppointmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,     
    AppRoutingModule,HttpClientModule, BrowserAnimationsModule,
   FormsModule,
    MatFormFieldModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,
    MatSelectModule,MatRadioModule,MatButtonModule,ReactiveFormsModule,MatSnackBarModule,
    MatPaginatorModule,MatTableModule,MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
