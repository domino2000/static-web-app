import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Main application component
 * @description This is a regular non-standalone component
 */
@Component({
  selector: 'app-root',
  template: `<div>{{message}}</div>`,
  styles: [],
  standalone: false
})
export class AppComponent implements OnInit {
  public message: string = 'Loading...';

  constructor(private httpClient: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchMessage();
  }

  private fetchMessage(): void {
    this.httpClient.get('/api/message').subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        // Extract the text property from the response object
        this.message = response.text || 'No message received';
      },
      error: (error) => {
        console.error('API error:', error);
        this.message = 'Failed to load message from API';
      }
    });
  }
}