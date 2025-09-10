import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../shared/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MedicineDialogComponent } from '../medicine-dialog/medicine-dialog.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  patients: any[] = [];
  doctors: any[] = [];
  appointments: any[] = [];
  displayedColumns: string[] = ['patientName', 'doctorName', 'appointmentDate', 'visitType', 'notes', 'diagnosis', 'actions'];
  totalAppointments = 0;
  pageSize = 10;
  currentPage = 0;
  editedRow: number | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  
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
    private snackBar: MatSnackBar,private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadAppointments(this.currentPage, this.pageSize);
  }

openMedicineDialog(appointment: any) {
  const dialogRef = this.dialog.open(MedicineDialogComponent, {
    width: '800px',
    data: { appointmentId: appointment.appointmentId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'updated') {
      this.loadAppointments(0, 10); 
    }
  });
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
          this.loadAppointments(0,10);
          this.snackBar.open('Appointment saved successfully!', 'Close', {
            duration: 3000,       
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
      next: (res: any) => {
        const data = res.data.map((a: any) => ({
          ...a,
          appointmentDate: new Date(a.appointmentDate)
        }));
        this.dataSource = new MatTableDataSource<any>(data);
        this.totalAppointments = res.total;

        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = (row, filter: string) => {
          return row.patientName.toLowerCase().includes(filter) ||
            row.doctorName.toLowerCase().includes(filter) ||
            row.notes.toLowerCase().includes(filter) ||
            row.diagnosis.toLowerCase().includes(filter);
        };
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadAppointments(this.currentPage, this.pageSize);
  }

  

  onDelete(element: any): void {
    if (confirm(`Are you sure you want to delete appointment for ${element.patientName}?`)) {
      this.appointmentService.deleteAppointment(element.appointmentId).subscribe({
        next: () => {
           this.loadAppointments(0, 10); 
        },
        error: (err) => console.error(err)
      });
    }
  }


  startEdit(element: any): void {
    debugger;
    this.editedRow = element.appointmentId;
  }

  cancelEdit(): void {
    this.editedRow = null;
  }

  saveEdit(element: any): void {
    debugger;    
  if (!element.visitType || element.visitType.trim() === '') {
    this.snackBar.open('Please select a Visit Type before saving.', 'Close', {
      duration: 3000,           
      horizontalPosition: 'right', 
      verticalPosition: 'top',     
      panelClass: ['error-snackbar'] 
    });
    return;
  }
    this.appointmentService.updateAppointment(element.appointmentId, element).subscribe({
      next: () => {
        this.editedRow = null;
        this.loadAppointments(this.currentPage, this.pageSize); 
      },
      error: (err: any) => console.error('Update error:', err)
    });
  }

// <p><b>Appointment ID:</b> ${element.appointmentId}</p>


onPrint(element: any) {
  this.http.get<any[]>(`https://localhost:7151/api/Appointment/getPrescriptionReport/${element.appointmentId}`)
    .subscribe(data => {
      // Date Formatting
      let appointmentDate = new Date(element.appointmentDate);
      debugger;
      let formattedAppointmentDate = appointmentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // HTML Report content
      let reportHtml = `
        <h2 style="text-align:center;">Prescription Report</h2>
        
        <p><b>Patient:</b> ${element.patientName}</p>
        <p><b>Doctor:</b> ${element.doctorName}</p>
        <p><b>Date:</b> ${formattedAppointmentDate}</p>
        <p><b>Visit Type:</b> ${element.visitType}</p>
        <table border="1" style="border-collapse:collapse; width:100%">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(item => {
        let startDate = new Date(item.startDate);
        let formattedStartDate = startDate.toLocaleDateString('en-US');

        let endDate = new Date(item.endDate);
        let formattedEndDate = endDate.toLocaleDateString('en-US');
        
        reportHtml += `
          <tr>
            <td>${item.medicineName}</td>
            <td>${item.dosage}</td>
            <td>${formattedStartDate}</td>
            <td>${formattedEndDate}</td>
            <td>${item.notes}</td>
          </tr>
        `;
      });

      reportHtml += `</tbody></table>`;

      // New popup window for printing
      const popupWin = window.open('', '_blank', 'width=800,height=600');
      if (popupWin) {
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Print Report</title>
              <style>
                @media print {
                  body { margin: 0; padding: 10px; }
                  table, th, td { border: 1px solid black; border-collapse: collapse; padding: 5px; }
                  th, td { text-align: left; }
                }
              </style>
            </head>
            <body onload="window.print();">
              ${reportHtml}
            </body>
          </html>
        `);
        popupWin.document.close();
      }
    });
}

}
