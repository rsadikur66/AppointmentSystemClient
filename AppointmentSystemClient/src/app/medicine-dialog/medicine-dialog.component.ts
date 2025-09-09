import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../shared/appointment.service';
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
  displayedColumns: string[] = ['name', 'dosage', 'actions'];
  selectedMedicine: any = null;
  prescription: any = {
   medicineId: '',
  dosage: '',
  startDate: '',
  endDate: '',
  notes: ''
};

  constructor(private http: HttpClient,private appointmentService: AppointmentService,private dialogRef: MatDialogRef<MedicineDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    // this.loadMedicines(data.appointmentId);
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

  addMedicine() {
    // new medicine যোগ করার জন্য form খুলবে
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
