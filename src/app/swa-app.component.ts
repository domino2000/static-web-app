import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  text: string;
}

interface NameOriginResponse {
  name: string;
  count: number;
  countries: Array<{
    countryId: string;
    probability: number;
  }>;
}

interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <span>My playground</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button aria-label="Refresh all data" (click)="refreshAllData()" class="hidden-button">
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
            <div class="api-description">
              <mat-icon class="description-icon">info</mat-icon>
              <p>Simple Azure Function that returns a welcome message and tracks refresh counts. Shows a special message every 10 refreshes!</p>
            </div>
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
            <div class="button-spacer"></div>
            <mat-card-actions align="end" class="card-actions">
              <button mat-button color="primary" (click)="fetchApi1Data()">REFRESH</button>
            </mat-card-actions>
          </mat-card>
          
          <!-- Second API Column - Name Origin Checker -->
          <mat-card class="api-card">
            <mat-card-header>
              <div mat-card-avatar class="card-header-icon">
                <mat-icon>public</mat-icon>
              </div>
              <mat-card-title>API #2</mat-card-title>
              <mat-card-subtitle>Check name origin</mat-card-subtitle>
            </mat-card-header>
            <div class="api-description">
              <mat-icon class="description-icon">travel_explore</mat-icon>
              <p>Discover the likely national origins of a name using probability data. Enter any name to see which countries it's most commonly associated with.</p>
            </div>
            <mat-card-content>
              <div class="name-input-container">
                <mat-form-field appearance="outline" class="name-input">
                  <mat-label>Enter a name</mat-label>
                  <input matInput [(ngModel)]="nameToCheck" placeholder="e.g. John, Maria, Chen" (keyup.enter)="checkNameOrigin()">
                </mat-form-field>
              </div>
              
              <div *ngIf="api2Loading" class="spinner-container">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
              
              <div *ngIf="!api2Loading && nameOriginResult" class="api-content name-results">
                <div class="result-header">
                  <h3>Results for "{{ nameOriginResult.name }}"</h3>
                  <div class="occurrence">
                    <mat-icon>people</mat-icon>
                    <span>Found in database {{ nameOriginResult.count }} times</span>
                  </div>
                </div>
                
                <div class="country-list">
                  <h4>Likely country origins:</h4>
                  <div *ngFor="let country of nameOriginResult.countries" class="country-item">
                    <div class="country-flag">{{ getCountryFlag(country.countryId) }}</div>
                    <div class="country-name">{{ getCountryName(country.countryId) }}</div>
                    <div class="country-probability">
                      <mat-progress-bar mode="determinate" [value]="country.probability * 100"></mat-progress-bar>
                      <span>{{ (country.probability * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div *ngIf="!api2Loading && !nameOriginResult && api2Message" class="api-content">
                <p>{{ api2Message }}</p>
              </div>
            </mat-card-content>
            <div class="button-spacer"></div>
            <mat-card-actions align="end" class="card-actions">
              <button mat-button color="primary" [disabled]="!nameToCheck || api2Loading" (click)="checkNameOrigin()">CHECK</button>
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
            <div class="api-description">
              <mat-icon class="description-icon">schedule</mat-icon>
              <p>Planned integration with external data sources. Will aggregate information from third-party services into a unified dashboard.</p>
            </div>
            <mat-card-content>
              <div *ngIf="api3Loading" class="spinner-container">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
              <div *ngIf="!api3Loading" class="api-content">
                <p>{{ api3Message }}</p>
              </div>
            </mat-card-content>
            <div class="button-spacer"></div>
            <mat-card-actions align="end" class="card-actions">
              <button mat-button color="primary" disabled>COMING SOON</button>
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
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .content-container {
      flex: 1;
      padding: 80px 16px 16px;
    }
    
    .column-layout {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      align-items: stretch;
    }
    
    .api-card {
      flex: 1;
      min-width: 200px;
      max-width: 400px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      padding-bottom: 60px; /* Make space for the button at the bottom */
    }
    
    /* First panel specific styles */
    .api-card:first-child .api-content {
      min-height: 300px; /* Increased fixed height to fully accommodate special message */
    }
    
    .card-header-icon {
      background-color: #3f51b5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-header-icon mat-icon {
      color: white;
    }
    
    .api-description {
      background-color: #f5f5f5;
      padding: 10px 16px;
      margin-bottom: 10px;
      border-radius: 4px;
      display: flex;
      align-items: flex-start;
    }
    
    .description-icon {
      margin-right: 8px;
      color: #3f51b5;
      flex-shrink: 0;
    }
    
    .api-content {
      min-height: 300px; /* Set all cards to have the same 300px minimum height */
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100px;
    }
    
    .refresh-counter {
      font-size: 0.9em;
      color: #666;
    }
    
    .special-message {
      font-weight: bold;
      color: #3f51b5;
      animation: pulse 2s infinite ease-in-out;
      background: linear-gradient(to right, #fff, #f5f5f5);
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #3f51b5;
      margin-top: 16px;
      margin-bottom: 16px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      position: relative;
      font-size: 1.1em;
      letter-spacing: 0.5px;
    }
    
    .special-message::before {
      content: "🎯";
      margin-right: 12px;
      font-size: 1.5em;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
    
    .name-input-container {
      margin-bottom: 15px;
    }
    
    .name-input {
      width: 100%;
    }
    
    .name-results {
      min-height: 300px; /* Ensure name results panel also has consistent height */
    }
    
    .result-header {
      margin-bottom: 15px;
    }
    
    .result-header h3 {
      margin-bottom: 5px;
    }
    
    .occurrence {
      display: flex;
      align-items: center;
      font-size: 0.9em;
      color: #666;
    }
    
    .occurrence mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      margin-right: 5px;
    }
    
    .country-list {
      margin-top: 15px;
    }
    
    .country-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap: 10px;
    }
    
    .country-flag {
      font-size: 1.5em;
      min-width: 30px;
      text-align: center;
    }
    
    .country-name {
      min-width: 100px;
    }
    
    .country-probability {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
    }
    
    .app-footer {
      background-color: #f5f5f5;
      padding: 10px;
      text-align: center;
      margin-top: 20px;
    }
    
    .hidden-button {
      visibility: hidden;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* Improved styles for consistent button alignment */
    mat-card {
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
    }

    .card-actions {
      padding: 8px 16px;
      margin: 0;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      text-align: right;
      background-color: white;
    }
  `],
  standalone: false
})
export class SwaAppComponent implements OnInit {
  public currentYear: number = new Date().getFullYear();
  public specialMessage: string = "Keep going! You're on a roll!";
  
  // API 1 properties
  public api1Message: string = 'Click REFRESH to load data from API';
  public api1Loading: boolean = false;
  public api1RefreshCounter: number = 0;
  public api1ShowSpecialMessage: boolean = false;
  
  // API 2 properties - Name Origin Checker
  public api2Message: string = '';
  public api2Loading: boolean = false;
  public nameToCheck: string = '';
  public nameOriginResult: NameOriginResponse | null = null;
  
  // API 3 properties
  public api3Message: string = 'Ready for your third API integration';
  public api3Loading: boolean = false;
  
  // Country mapping for display
  private countryMap: { [key: string]: CountryInfo } = {
    'US': { code: 'US', name: 'United States', flag: '🇺🇸' },
    'GB': { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    'DE': { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    'FR': { code: 'FR', name: 'France', flag: '🇫🇷' },
    'IT': { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    'ES': { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    'CA': { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    'AU': { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    'JP': { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    'CN': { code: 'CN', name: 'China', flag: '🇨🇳' },
    'IN': { code: 'IN', name: 'India', flag: '🇮🇳' },
    'BR': { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    'RU': { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    'MX': { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    'ID': { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    'NG': { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    'PK': { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
    'BD': { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
    'RO': { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    'PH': { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    'NE': { code: 'NE', name: 'Niger', flag: '🇳🇪' },
    'GH': { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    'NA': { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
    // Additional country codes
    'AF': { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
    'AL': { code: 'AL', name: 'Albania', flag: '🇦🇱' },
    'DZ': { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
    'AR': { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    'AT': { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    'BY': { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
    'BE': { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    'BO': { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
    'BA': { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    'BG': { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
    'KH': { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
    'CM': { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
    'CL': { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    'CO': { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    'CR': { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
    'HR': { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
    'CU': { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
    'CY': { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
    'CZ': { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
    'DK': { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    'DO': { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
    'EC': { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
    'EG': { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    'SV': { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
    'EE': { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
    'ET': { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
    'FI': { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    'GE': { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
    'GR': { code: 'GR', name: 'Greece', flag: '🇬🇷' },
    'GT': { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
    'HT': { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
    'HN': { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
    'HK': { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    'HU': { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
    'IS': { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
    'IR': { code: 'IR', name: 'Iran', flag: '🇮🇷' },
    'IQ': { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
    'IE': { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    'IL': { code: 'IL', name: 'Israel', flag: '🇮🇱' },
    'JM': { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
    'JO': { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
    'KZ': { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
    'KE': { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    'KR': { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    'KW': { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
    'LV': { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
    'LB': { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
    'LY': { code: 'LY', name: 'Libya', flag: '🇱🇾' },
    'LT': { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
    'LU': { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
    'MY': { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    'ML': { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    'MT': { code: 'MT', name: 'Malta', flag: '🇲🇹' },
    'MR': { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
    'MA': { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
    'MM': { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
    'NP': { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
    'NL': { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    'NZ': { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    'NI': { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
    'NO': { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    'OM': { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    'PA': { code: 'PA', name: 'Panama', flag: '🇵🇦' },
    'PY': { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
    'PE': { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    'PL': { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    'PT': { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    'QA': { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
    'SA': { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    'SN': { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
    'RS': { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
    'SG': { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    'SK': { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    'SI': { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    'ZA': { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    'LK': { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
    'SE': { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    'CH': { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    'SY': { code: 'SY', name: 'Syria', flag: '🇸🇾' },
    'TW': { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
    'TJ': { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
    'TZ': { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    'TH': { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    'TN': { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
    'TR': { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    'UG': { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    'UA': { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
    'AE': { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    'UY': { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    'UZ': { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
    'VE': { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
    'VN': { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
    'YE': { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
    'ZM': { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
    'ZW': { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
  };

  constructor(private httpClient: HttpClient) {}
  
  ngOnInit(): void {
    // API message will only load when refresh is clicked
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
        this.api1Message = `${baseMessage}`;
        //this.api1Message = `${baseMessage} (Refresh #${this.api1RefreshCounter})`;
        this.api1Loading = false;
      },
      error: (error) => {
        console.error('API 1 error:', error);
        this.api1Message = `Failed to load message from API (Refresh #${this.api1RefreshCounter})`;
        this.api1Loading = false;
      }
    });
  }
  
  checkNameOrigin(): void {
    if (!this.nameToCheck) return;
    
    this.api2Loading = true;
    this.nameOriginResult = null;
    
    this.httpClient.get<NameOriginResponse>(`/api/checknameorigin?name=${encodeURIComponent(this.nameToCheck)}`).subscribe({
      next: (response) => {
        console.log('Name origin response:', response);
        this.nameOriginResult = response;
        this.api2Loading = false;
      },
      error: (error) => {
        console.error('Name origin error:', error);
        this.api2Message = 'Failed to check name origin. Please try again.';
        this.nameOriginResult = null;
        this.api2Loading = false;
      }
    });
  }
  
  getCountryFlag(countryCode: string): string {
    return this.countryMap[countryCode]?.flag || '🌍';
  }
  
  getCountryName(countryCode: string): string {
    return this.countryMap[countryCode]?.name || countryCode;
  }
  
  refreshAllData(): void {
    this.fetchApi1Data();
    if (this.nameToCheck) {
      this.checkNameOrigin();
    }
    // The third API is not implemented yet
  }
}