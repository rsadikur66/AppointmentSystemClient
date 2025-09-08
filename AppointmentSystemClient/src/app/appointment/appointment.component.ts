import { Component, OnInit,ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../shared/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  patients: any[] = [];
  doctors: any[] = [];
  appointments: any[] = [];
  displayedColumns: string[] = ['patientName', 'doctorName', 'appointmentDate','visitType','notes','diagnosis', 'actions'];
 totalAppointments = 0;
  pageSize = 10;
  currentPage = 0;
  editedRow: number | null = null;
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  // 👇 একটাই object যেটায় form-এর সব field থাকবে
  appointment: any = {
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    visitType: '1',
    notes: '',
    diagnosis: ''
  };

  constructor(
    private http: HttpClient, 
    private appointmentService: AppointmentService,
     private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadAppointments(this.currentPage, this.pageSize);
  }

  loadPatients() {
    this.http.get<any[]>('https://localhost:7151/api/Appointment/getAllPatientsList')
      .subscribe(data => this.patients = data);
  }

  loadDoctors() {
    this.http.get<any[]>('https://localhost:7151/api/Appointment/getAllDoctorsList')
      .subscribe(data => this.doctors = data);
  }

  onInsert() {
  this.appointmentService.insertAppointment(this.appointment)
    .subscribe({
      next: (res) => {
        this.snackBar.open('Appointment saved successfully!', 'Close', {
          duration: 3000,       // 3 seconds
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open('Error occurred while saving appointment!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  loadAppointments(pageIndex: number, pageSize: number) {
    this.appointmentService.getAppointments(pageIndex, pageSize).subscribe({
      next: (res:any) => {
        debugger;
        this.appointments = res.data.map((a:any) => ({
      ...a,
      appointmentDate: new Date(a.appointmentDate),  // ✅ Date object
      patientId: a.patientId,
      doctorId: a.doctorId
    }));
    this.totalAppointments = res.total;
  },
  error: (err) => console.error(err)
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadAppointments(this.currentPage, this.pageSize);
  }

  // 🖊️ Edit Button Click
  onEdit(element: any): void {
    console.log("Edit clicked", element);
    // এখানে তুমি dialog খুলতে পারো অথবা form এ value বসাতে পারো
    // উদাহরণ:
    // const dialogRef = this.dialog.open(AppointmentEditDialog, { data: element });
  }

    // 🗑️ Delete Button Click
  onDelete(element: any): void {
    // if (confirm(`Are you sure you want to delete appointment for ${element.patientName}?`)) {
    //   this.appointmentService.deleteAppointment(element.id).subscribe({
    //     next: () => {
    //       this.loadAppointments(); // আবার reload করবে
    //     },
    //     error: (err) => console.error(err)
    //   });
    // }
  }


  startEdit(element: any): void {
    debugger;
  this.editedRow = element.appointmentId;
}

cancelEdit(): void {
  this.editedRow = null;
}

saveEdit(element: any): void {
  this.appointmentService.updateAppointment(element.appointmentId, element).subscribe({
    next: () => {
      this.editedRow = null;
      this.loadAppointments(this.currentPage, this.pageSize); // reload after update
    },
    error: (err : any) => console.error('Update error:', err)
  });
}


}
