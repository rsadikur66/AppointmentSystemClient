import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prescription-report',
  templateUrl: './prescription-report.component.html',
  styleUrls: ['./prescription-report.component.scss']
})
export class PrescriptionReportComponent implements OnInit {

  prescriptionData: any[] = [];

  @ViewChild('reportContent') reportContent!: ElementRef;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPrescription();
  }

  loadPrescription() {
    this.http.get<any[]>('https://localhost:7151/api/Appointment/prescriptionReport/1') 
      .subscribe(res => {
        this.prescriptionData = res;
      });
  }

    printReport() {
    const printContents = this.reportContent.nativeElement.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Prescription Report</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 5px; text-align: left; }
              h2 { text-align: center; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin.document.close();
    }
  }

}
