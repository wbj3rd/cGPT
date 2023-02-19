import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-emoji-loader',
  templateUrl: './emoji-loader.component.html',
  styleUrls: ['./emoji-loader.component.scss']
})
export class EmojiAnimationComponent implements OnInit {
  @Input() duration: number = 7000; // Animation duration in milliseconds
  viewBox: string = '0 0 100 100';
  fill: string = 'yellow';
  eyeFill: string = 'black';
  
  ngOnInit() {
    const start = new Date().getTime(); // Start time
    const end = start + this.duration; // End time
    const yellow = [255, 255, 0];
    const red = [255, 0, 0];
    const diff = [red[0] - yellow[0], red[1] - yellow[1], red[2] - yellow[2]];
    
    // Animation loop
    const loop = () => {
      const now = new Date().getTime(); // Current time
      const progress = (now - start) / this.duration; // Progress as a fraction of total duration
      
      // Update fill color
      const r = Math.floor(yellow[0] + diff[0] * progress);
      const g = Math.floor(yellow[1] + diff[1] * progress);
      const b = Math.floor(yellow[2] + diff[2] * progress);
      this.fill = `rgb(${r},${g},${b})`;
      
      // Update eye color
      if (progress < 0.5) {
        this.eyeFill = 'black';
      } else {
        this.eyeFill = 'white';
      }
      
      // Check if animation is finished
      if (now < end) {
        requestAnimationFrame(loop); // Continue animation
      } else {
        this.fill = 'red'; // Set final color
        this.eyeFill = 'white';
      }
    };
    
    requestAnimationFrame(loop); // Start animation
  }
}