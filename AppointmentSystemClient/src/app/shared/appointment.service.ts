import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'https://localhost:7151/api/Appointment'; // তোমার backend অনুযায়ী update করবে

  constructor(private http: HttpClient) {}

   getAppointments(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPagedAppointments?page=${pageIndex + 1}&pageSize=${pageSize}&sortBy=AppointmentDate&sortOrder=DESC`);
  }

  getMedicinesByAppointmentId(appointmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getMedicinesByAppointmentId/${appointmentId}`);
  }

  insertAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, appointment);
  }

  updateAppointment(id: number, appointment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateAppointment/${id}`, appointment);
  }

  // Delete appointment method (আপনার已有的)
  deleteAppointment(id: number): Observable<any> {
    debugger;
    return this.http.delete(`${this.apiUrl}/deleteAppointment/${id}`);
  }
  saveMedicines(prescriptions: any[]): Observable<any> {
    debugger;
    return this.http.post(`${this.apiUrl}/SavePrescriptions`, prescriptions);
  }

  updateMedicine(medicine: any) {
    debugger;
  return this.http.put<any>(`${this.apiUrl}/updatePrescription`, medicine);
}


deleteMedicine(prescriptionId: number) {
  return this.http.delete<any>(`${this.apiUrl}/deletePrescription/${prescriptionId}`);
}



}
