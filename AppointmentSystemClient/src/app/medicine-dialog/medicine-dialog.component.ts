import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../shared/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-medicine-dialog',
  templateUrl: './medicine-dialog.component.html',
  styleUrls: ['./medicine-dialog.component.scss']
})

export class MedicineDialogComponent implements OnInit {
  medicines: any[] = [];
  prescriptions: any[] = [];
  prescriptionList: any[] = []; // temporary list
  displayedColumns: string[] = ['name', 'dosage', 'actions'];
  selectedMedicine: any = null;

  prescription: any = {
   medicineId: '',
  dosage: '',
  startDate: '',
  endDate: '',
  notes: ''
};


  constructor(private http: HttpClient,private snackBar: MatSnackBar,private appointmentService: AppointmentService,private dialogRef: MatDialogRef<MedicineDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.loadPrescription(data.appointmentId);
    this.loadMedicines();
  }

  ngOnInit(): void {
  }

 
 onMedicineChange(value: any) {
    console.log('👉 Selected Medicine ID:', value);

    const selectedObj = this.medicines.find(m => m.id === value);
    console.log('👉 Full Medicine Object:', selectedObj);

    this.selectedMedicine = selectedObj;
  }
  // loadMedicines(appointmentId: number) {
  //   // API থেকে ওই appointment এর medicine লিস্ট আনবে
  //   this.appointmentService.getMedicinesByAppointmentId(appointmentId).subscribe(res => {
  //     this.medicines = res;
  //   });
  // }

 loadMedicines() {
  debugger;
    this.http.get<any[]>('https://localhost:7151/api/Appointment/getAllMedicinesList')
      .subscribe(data => this.medicines = data);
  }
loadPrescription(appointment:any) {
  debugger;
  this.appointmentService.getMedicinesByAppointmentId(appointment.appointmentId).subscribe(res => {
    appointment.medicines = res;
  });
  debugger;
    this.http.get<any[]>('https://localhost:7151/api/Appointment/getAllMedicinesList')
      .subscribe(data => this.medicines = data);
  }
 // Add medicine to temporary list
  addMedicine() {
  // copy current prescription object to avoid reference issues
  this.prescriptionList.push({ 
    ...this.prescription,
    appointmentId: this.data.appointmentId
  });

  // reset form for next input
  this.prescription = {
    medicineId: null,
    dosage: '',
    startDate: null,
    endDate: null,
    notes: ''
  };
}
// Save all medicines to DB
saveAllMedicines() {
  debugger;
    this.appointmentService.saveMedicines(this.prescriptionList).subscribe({
      next: (res:any) => {
        console.log('Saved successfully');
        this.snackBar.open('Medicines saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        this.prescriptionList = []; // clear after saving
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error saving medicines. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }
getMedicineName(id: number) {
  debugger;
  const med = this.medicines.find(m => m.medicineID === id);
  return med ? med.name : '';
}
  editMedicine(med: any) {
    // medicine edit করার ব্যবস্থা
  }

  deleteMedicine(id: number) {
    // medicine delete করার API call
  }

  close() {
    this.dialogRef.close('updated');
  }

}
