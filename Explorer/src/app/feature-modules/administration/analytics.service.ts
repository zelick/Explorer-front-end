import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiKey = 'YOUR_GOOGLE_ANALYTICS_API_KEY';
  private viewId = 'YOUR_GOOGLE_ANALYTICS_VIEW_ID';

  constructor(private http: HttpClient) {}

  fetchData(startDate: string, endDate: string) {
    const url = `https://www.googleapis.com/analytics/v3/data/ga?ids=ga:${this.viewId}&start-date=${startDate}&end-date=${endDate}&metrics=ga:pageviews,ga:users&key=${this.apiKey}`;

    return this.http.get<any>(url);
  }

  generateExcel(data: any[]) {
    // Modify and calculate statistics on the data if needed
    const modifiedData = this.modifyData(data);

    // Convert modified data to Excel
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(modifiedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Create a Blob and return it
    return XLSX.write(wb, { bookType: 'xlsx', type: 'blob' as 'string' | 'base64' | 'binary' | 'buffer' | 'file' | 'array' | undefined });
  }

  private modifyData(data: any[]): any[] {
    // Add your modification logic here
    return data;
  }

  calculateMean(values: number[]): number {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }

  calculateStandardDeviation(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((acc, squaredDiff) => acc + squaredDiff, 0) / values.length;
    return Math.sqrt(variance);
  }
}
