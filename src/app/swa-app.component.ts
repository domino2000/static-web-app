import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  text: string;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <span>API Dashboard</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button aria-label="Refresh all data" (click)="refreshAllData()">
          <mat-icon>refresh</mat-icon>
        </button>
      </mat-toolbar>
      
      <div class="content-container">
        <div class="column-layout">
          <!-- First API Column -->
          <mat-card class="api-card">
            <mat-card-header>
              <div mat-card-avatar class="card-header-icon">
                <mat-icon>cloud</mat-icon>
              </div>
              <mat-card-title>API #1</mat-card-title>
              <mat-card-subtitle>Message API</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="api1Loading" class="spinner-container">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
              <div *ngIf="!api1Loading" class="api-content">
                <p>{{ api1Message }}</p>
                <p class="refresh-counter">Refresh count: {{ api1RefreshCounter }}</p>
                <p *ngIf="api1ShowSpecialMessage" class="special-message">
                  {{ specialMessage }}
                </p>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button color="primary" (click)="fetchApi1Data()">REFRESH</button>
            </mat-card-actions>
          </mat-card>
          
          <!-- Second API Column -->
          <mat-card class="api-card">
            <mat-card-header>
              <div mat-card-avatar class="card-header-icon">
                <mat-icon>storage</mat-icon>
              </div>
              <mat-card-title>API #2</mat-card-title>
              <mat-card-subtitle>Future API</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="api2Loading" class="spinner-container">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
              <div *ngIf="!api2Loading" class="api-content">
                <p>{{ api2Message }}</p>
                <p class="refresh-counter">Refresh count: {{ api2RefreshCounter }}</p>
                <p *ngIf="api2ShowSpecialMessage" class="special-message">
                  {{ specialMessage }}
                </p>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button color="primary" (click)="fetchApi2Data()">REFRESH</button>
            </mat-card-actions>
          </mat-card>
          
          <!-- Third API Column -->
          <mat-card class="api-card">
            <mat-card-header>
              <div mat-card-avatar class="card-header-icon">
                <mat-icon>data_usage</mat-icon>
              </div>
              <mat-card-title>API #3</mat-card-title>
              <mat-card-subtitle>Future API</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="api3Loading" class="spinner-container">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
              <div *ngIf="!api3Loading" class="api-content">
                <p>{{ api3Message }}</p>
                <p class="refresh-counter">Refresh count: {{ api3RefreshCounter }}</p>
                <p *ngIf="api3ShowSpecialMessage" class="special-message">
                  {{ specialMessage }}
                </p>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button color="primary" (click)="fetchApi3Data()">REFRESH</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
      
      <footer class="app-footer">
        <p>&copy; {{ currentYear }} API Dashboard - Azure Static Web App</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,.2);
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .content-container {
      flex: 1;
      padding: 24px;
    }
    
    .column-layout {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .api-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }
    
    .api-card:hover {
      transform: translateY(-5px);
    }
    
    .card-header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f0f4f8;
      border-radius: 50%;
    }
    
    .api-content {
      min-height: 100px;
      padding: 16px 0;
    }
    
    .refresh-counter {
      font-size: 0.9em;
      color: #666;
      margin-top: 8px;
    }
    
    .special-message {
      margin-top: 16px;
      padding: 8px 16px;
      background-color: #e3f2fd;
      border-radius: 4px;
      font-weight: 500;
      color: #1976d2;
      border-left: 4px solid #1976d2;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }
    
    .app-footer {
      background-color: #f5f5f5;
      padding: 16px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }
    
    @media (max-width: 960px) {
      .column-layout {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 600px) {
      .column-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
  standalone: false
})
export class SwaAppComponent implements OnInit {
  public currentYear: number = new Date().getFullYear();
  public specialMessage: string = "Keep going! You're on a roll!";
  
  // API 1 properties
  public api1Message: string = 'Loading...';
  public api1Loading: boolean = true;
  public api1RefreshCounter: number = 0;
  public api1ShowSpecialMessage: boolean = false;
  
  // API 2 properties
  public api2Message: string = 'Ready for your second API integration';
  public api2Loading: boolean = false;
  public api2RefreshCounter: number = 0;
  public api2ShowSpecialMessage: boolean = false;
  
  // API 3 properties
  public api3Message: string = 'Ready for your third API integration';
  public api3Loading: boolean = false;
  public api3RefreshCounter: number = 0;
  public api3ShowSpecialMessage: boolean = false;

  constructor(private httpClient: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchApi1Data();
  }

  fetchApi1Data(): void {
    this.api1Loading = true;
    
    // Increment the counter each time fetchApi1Data is called
    this.api1RefreshCounter++;
    
    // Check if we should show the special message (every 10 counts)
    this.api1ShowSpecialMessage = this.api1RefreshCounter % 10 === 0 && this.api1RefreshCounter > 0;
    
    // Use absolute path to ensure SWA proxies correctly
    this.httpClient.get<ApiResponse>('/api/message').subscribe({
      next: (response) => {
        console.log('API 1 response:', response);
        // Add the refresh count to the message
        const baseMessage = response.text || 'No message received';
        this.api1Message = `${baseMessage} (Refresh #${this.api1RefreshCounter})`;
        this.api1Loading = false;
      },
      error: (error) => {
        console.error('API 1 error:', error);
        this.api1Message = `Failed to load message from API (Refresh #${this.api1RefreshCounter})`;
        this.api1Loading = false;
      }
    });
  }
  
  fetchApi2Data(): void {
    this.api2Loading = true;
    
    // Increment the counter each time fetchApi2Data is called
    this.api2RefreshCounter++;
    
    // Check if we should show the special message (every 10 counts)
    this.api2ShowSpecialMessage = this.api2RefreshCounter % 10 === 0 && this.api2RefreshCounter > 0;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      this.api2Message = `Future API 2 data will appear here (Refresh #${this.api2RefreshCounter})`;
      this.api2Loading = false;
    }, 1000);
  }
  
  fetchApi3Data(): void {
    this.api3Loading = true;
    
    // Increment the counter each time fetchApi3Data is called
    this.api3RefreshCounter++;
    
    // Check if we should show the special message (every 10 counts)
    this.api3ShowSpecialMessage = this.api3RefreshCounter % 10 === 0 && this.api3RefreshCounter > 0;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      this.api3Message = `Future API 3 data will appear here (Refresh #${this.api3RefreshCounter})`;
      this.api3Loading = false;
    }, 1000);
  }
  
  refreshAllData(): void {
    this.fetchApi1Data();
    this.fetchApi2Data();
    this.fetchApi3Data();
  }
}