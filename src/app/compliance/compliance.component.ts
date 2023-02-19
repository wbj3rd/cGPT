import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})
export class ComplianceComponent implements OnInit{

  stage$:BehaviorSubject<number> = new BehaviorSubject(0)
  
  ngOnInit(): void {
    
  } 
}
