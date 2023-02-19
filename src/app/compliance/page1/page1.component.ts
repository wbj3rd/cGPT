import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { from, Observable, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, retry, retryWhen, shareReplay, tap } from 'rxjs/operators';
@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];
  complianceIndustries = [
    'Mental Health',
    'Banking and finance',
    'Insurance',
    'Healthcare',
    'Pharmaceuticals',
    'Education',
    'Energy',
    'Environmental',
    'Mining and minerals',
    'Construction',
    'Real estate',
    'Food and beverage',
    'Agriculture',
    'Chemicals',
    'Manufacturing',
    'Transportation and logistics',
    'Telecommunications',
    'Information technology',
    'Data protection and privacy',
    'Security and surveillance',
    'Retail',
    'E-commerce',
    'Hospitality',
    'Tourism',
    'Entertainment',
    'Sports',
    'Gaming',
    'Media and publishing',
    'Advertising and marketing',
    'Government and public sector',
    'Non-profit organizations',
    'International trade and customs',
    'Pharmaceuticals and biotech',
    'Medical devices',
    'Cosmetics and personal care',
    'Consumer products',
    'Electronics and electrical products',
    'Automotive',
    'Aviation and aerospace',
    'Defense and military',
    'Firearms and explosives',
    'Chemicals and hazardous materials',
    'Waste management',
    'Water treatment and sanitation',
    'Construction and engineering',
    'Architecture and design',
    'Legal services',
    'Accounting and auditing',
    'Consulting and advisory services',
    'Human resources and employment',
    'Insurance and risk management'
  ];
  working = false
  docsLoaded:boolean = false
  multiEdit = false
  listOfUserIndustries: Array<string>  = []
  stateDocs:Array<string> = []
  orgs$: Observable<Array<string>> | undefined;
  currentOrgs: Array<string> = []
  currentDocs: Array<string> = []
  docs: Array<string> = []
  menu: Array<{}> | undefined
  showFiller = false;
  state:string | undefined
  industry: string | undefined
  formattedMessage: string | undefined;
  step1 = new FormGroup({
    state: new FormControl('', Validators.required),
    industry: new FormControl('', Validators.required)
  })
  checkboxForm: FormGroup;
  checkboxForm2: FormGroup;
  checkboxOptions: any = []
  checkboxOptions2: any = []
  superDocList: Array<{}>  = []
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.checkboxForm = this.fb.group({
      checkboxes: this.fb.array([])


    })
    this.checkboxForm2 = this.fb.group({
      checkbloxes: this.fb.array([])


    })
  }
  ngOnInit(): void {
    let storedOrgs = localStorage.getItem('orgs');
    let storedDocList = localStorage.getItem('docList');
    let storedDocs = localStorage.getItem('docs');
    let state = localStorage.getItem('state');
    let industry = localStorage.getItem('industry');
    let sdl = localStorage.getItem('superDocList');
    if (storedOrgs) {
      this.currentOrgs = JSON.parse(storedOrgs);
      this.generateCheckboxes();
    }
    if (storedDocs) {
      this.docs = JSON.parse(storedDocs);
      //this.generateCheckboxes();
    }    
    if (storedDocList) {
      this.currentDocs = JSON.parse(storedDocList);
      this.generateCheckboxes2();
      this.working = false
        }
        else{
          this.working = true
        }
    if (sdl) {
      this.superDocList = JSON.parse(sdl);
      //this.generateCheckboxes2();
      this.stateDocs = [...new Set(JSON.parse(sdl).map((x:any)=>x.state as string))] as string[]
      this.listOfUserIndustries = [...new Set(JSON.parse(sdl).map((x:any)=>x.industry as string))]as string[]
    }    
    if (state) {
      this.state = state
      this.step1.controls.state.setValue(state)
    
    }   
    if (industry) {
      this.industry = industry
      this.step1.controls.industry.setValue(industry)
    }      
    this.onChanges();
    
  }
loadDoc(index:any,industry:any, state?:any){
  const docToLoad = this.superDocList.filter((x:any)=>x.industry===industry && x.state===state)[index] as any
  console.log(docToLoad)
  this.docs = []
  this.docs.push(docToLoad.text)

  //console.log()
  this.docsLoaded = true
  //this.multiEdit = false
  return docToLoad
}
getCurrent(industry:any, state:any){

  return this.superDocList.filter((x:any)=>x.industry===industry && x.state===state).map((x:any)=>x.text.split("\n")[0])
}
onChanges(): void {
  this.step1.valueChanges.subscribe(val => {

    var question1 =
      `Show me a list of 15 organizations and agencies in ${val.state} who are responsible`
      + ` for regulations, accreditation and compliance in the state of ${val.industry}.Rank them in importance from 1 to 10 with 10 bring the worst. If the name is longer than 100 characters list the acronym`;
    console.log(question1)
    
    console.log(this.step1)
    if (this.step1.status === "VALID") {
      // call to chatGPT with question

      const cachedResponse = localStorage.getItem(question1);
      if (cachedResponse) {
        const orgs = JSON.parse(cachedResponse);
        this.currentOrgs = orgs;
        this.generateCheckboxes();
      } else {
        // Make the HTTP request and cache the response
        
        this.orgs$ = this.http.post('http://localhost:3000/ask/chatGPT', { question: question1 }).pipe(
          retry(3),
          map((res: any) => {
            const orgs = res.text.split("\n").map((x: string, index: number) => {
              return x.split(". ")[1]?.trim();
            });
            localStorage.setItem("orgs", JSON.stringify(orgs));
            return orgs;
          }),
          shareReplay(1, 30 * 60 * 1000), // Share the result with replay for 30 minutes
          catchError(error => {
            console.error(error);
            return throwError(error);
          })
        );
        this.orgs$.subscribe(orgs => {
          this.currentOrgs = orgs;
          this.generateCheckboxes();
          this.working = false
        });
      }
      localStorage.setItem("state", this.step1.controls.state.value!.toString());
  localStorage.setItem("industry", this.step1.controls.industry.value!.toString());
    } else {
      console.log("INVALID")
    }
  });

}


  getDocList() {
    this.working = true
    console.log("GET DOCS LIST")
    var orgs = this.checkboxForm.value.checkboxes.map((x: any, index: any) => { if (x) { return this.currentOrgs[index] } else { return undefined } }).filter((x: any) => { if (x) return x })
    console.log(orgs)
    var question1 = "Give me a list of 30 policy and procedures document titles needed to satisfy the compliance requirements of " + orgs.concat(", ") +
      ". each list items should be less than 5 words , be in titlecase and end with the word policy also sort the list in ascending alphabeltical order"+
      " i.e. Money Laundering Prevention Policy or Incident Response Policy."
    this.http.post('http://localhost:3000/ask/chatGPT', { question: question1 }).subscribe((res: any) => {
      let docs = res.text.split("\n").map((x: string, index: number) => {

        return x.split(". ")[1]?.trim()

      })
      this.currentDocs = docs
      this.generateCheckboxes2();
      localStorage.setItem('docList', JSON.stringify(docs));
      this.working = false
    })
  }


  generateCheckboxes() {
    const checkboxes = this.checkboxForm.get('checkboxes') as FormArray;
    checkboxes.clear();

    this.checkboxOptions = this.currentOrgs;

    this.checkboxOptions.forEach((option: any) => {
      const control = this.fb.control(false);
      checkboxes.push(control);
    });
  }
  generateCheckboxes2() {
    const checkboxes = this.checkboxForm2.get('checkbloxes') as FormArray;
    checkboxes.clear();

    this.checkboxOptions2 = this.currentDocs;

    this.checkboxOptions2.forEach((option: any) => {
      const control = this.fb.control(false);
      checkboxes.push(control);
    });
  }
  getDocs() {
    console.log("GET DOCS");
    this.working = true
    const orgs = this.checkboxForm.value.checkboxes.map((x: any, index: any) => {
      if (x) { return this.currentOrgs[index]; }
      else { return undefined; }
    }).filter((x: any) => { if (x) return x; });
  
    const docs = this.checkboxForm2.value.checkbloxes.map((x: any, index: any) => {
      if (x) { return this.currentDocs[index]; }
      else { return undefined; }
    }).filter((x: any) => { if (x) return x; });
  
    from(docs).pipe(
      concatMap((doc) => {
        const question1 = `Write a policy for the with the following title, ${doc}. The policy should be at least 500 words longs and satisfy the requirement of the following organzations ${orgs.concat(", ")}."`;
        return this.http.post('http://localhost:3000/ask/chatGPT', { question: question1 });
      }),
      retryWhen(errors => {
        return errors.pipe(
          delay(1000),
          tap(err => console.error('Request error: ', err)),
          concatMap((error, count) => {
            if (count >= 5 || error.status === 200) {
              return throwError(error);
            }
            return from([error]);
          })
        );
      }),
      tap((res: any) => {
        console.log("TAPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPp")
        const doc = res.text;
        const d = {
          state : this.step1.controls.state.value,
          industry: this.step1.controls.industry.value,
          text:res.text,
          title: res.text.split("\n")[0]
        }
        if(!this.listOfUserIndustries.includes(this.step1.controls.industry.value!.toString())){
          this.listOfUserIndustries.push(this.step1.controls.industry.value!)
        }
        if(!this.stateDocs.includes(this.step1.controls.state.value!)){
          this.stateDocs.push(this.step1.controls.state.value!)
        }
        console.log(d)
        this.docs.push(doc);
        this.superDocList?.push(d)
        localStorage.setItem('docs', JSON.stringify(this.docs));
        localStorage.setItem('superDocList', JSON.stringify(this.superDocList));
        //this.generateCheckboxes2();
      })
    ).subscribe({
      next: (x) => {
        this.docsLoaded = true;
        this.working = false
      },
      error: (err) => {
        console.error('Request failed after 5 retries');
      }
    });
  }
  updateValue(editedText: any,i?:any) {
    //console.log(editedText,i)
    if(this.multiEdit){
    this.docs[i] = editedText;
    localStorage.setItem('docs', JSON.stringify(this.docs));
    }else{
      //set superDocList  where state industry and title equal this
     this.superDocList.map((x:any)=>{
      console.log(editedText.split("\n"))
        if(x.title===editedText.split("\n")[0])
        x.text = editedText
        this.docs[i] = editedText 
        return x

     })
    //  editedText;
      //set superDoc in local storage    
    }
  }
  clearCache(){
    localStorage.setItem('docs', '');
    localStorage.setItem('orgs', '');
    localStorage.setItem('superDocList', '');
    localStorage.setItem('state', '');
    localStorage.setItem('industry', '');
  }
}
