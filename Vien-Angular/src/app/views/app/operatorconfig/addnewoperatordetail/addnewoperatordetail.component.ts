



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addnewoperatordetail',
  templateUrl: './addnewoperatordetail.component.html',
  styleUrls: ['./addnewoperatordetail.component.scss']
})
export class AddnewoperatordetailComponent implements OnInit {
  
  addNewGeneratorForm: FormGroup;
  constructor(private router: Router,private fb: FormBuilder, private http: HttpClient, private authService: AuthService,) {}

countries:any[]=[];
  selectedFile: File | null = null;
  HelpImage: File | null = null;

  apiUrl= this.authService.baseUrl;

  ngOnInit(): void {
    this.addNewGeneratorForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      OperatorName: ['', Validators.required],
      ContactctNumber: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Date: [''],
      RegisteredAddress: [''],
      RegisteredCity: [''],
      TradingAddress: [''],
      TradingCity: [''],
      RegisteredCounty: [''],
      TradingCounty: [''],
      RegisteredCountryId: [1],
      TradingCountryId: [1],
      RegisteredZipCode: [''],
      TradingZipCode: [''],
      VatRegistered: [''],
      VatNumber: ['', Validators.required],
      Profile: [''],
      Notes: [''],
     
      RoleId: [1],
      HelpImage: [''],
      active: [false],
      Heading: [''],
      Content: [''],
      IsMicrosoftAccount: [false],
    });

this.Getcountries();
}


Getcountries(){
  this.authService.GetCountries().subscribe(
    response => {
      debugger
      if (JSON.parse(response) ) {
const data=JSON.parse(response);
        this.countries = data.result;
      } else {
        this.countries = []; // Default to an empty array if the response is not in the expected format
        console.error('Unexpected response format:', response);
      }
    },
    error => {
      console.error('Error saving form', error);
    }
  );

}
onFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}
HelpImageselect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.HelpImage = input.files[0];
  }
}

onCheckboxChange(event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  const isChecked = checkbox.checked;

  if (isChecked) {
    // Set the value of 'TradingAddress' based on 'RegisteredAddress'
    this.addNewGeneratorForm.get('TradingAddress')?.setValue(this.addNewGeneratorForm.value?.RegisteredAddress);
    this.addNewGeneratorForm.get('TradingCity')?.setValue(this.addNewGeneratorForm.value?.RegisteredCity);
    this.addNewGeneratorForm.get('TradingCounty')?.setValue(this.addNewGeneratorForm.value?.RegisteredCounty);
    this.addNewGeneratorForm.get('TradingCountryId')?.setValue(this.addNewGeneratorForm.value?.RegisteredCountryId);
    this.addNewGeneratorForm.get('TradingZipCode')?.setValue(this.addNewGeneratorForm.value?.RegisteredZipCode);
  } else {
    // Clear the values in the 'Trading' fields
    this.addNewGeneratorForm.get('TradingAddress')?.setValue('');
    this.addNewGeneratorForm.get('TradingCity')?.setValue('');
    this.addNewGeneratorForm.get('TradingCounty')?.setValue('');
    this.addNewGeneratorForm.get('TradingCountryId')?.setValue(null);  // If it's an integer field, null might be appropriate
    this.addNewGeneratorForm.get('TradingZipCode')?.setValue('');
  }
  
  

}
onSubmit(): void {
  debugger
  if (this.addNewGeneratorForm.invalid) {
    alert("Please fill all required fields correctly.");
    return;
  }

  const formData = new FormData();
  
  // Append form fields
  Object.keys(this.addNewGeneratorForm.controls).forEach(key => {
    if (key === 'active') {
      formData.append(key, this.addNewGeneratorForm.get(key)?.value ? 'true' : 'false'); // Convert boolean to string
    }
    else if(key === 'VatRegistered'){
      let regvat;
      if(this.addNewGeneratorForm.value?.VatRegistered=="yes"){
        regvat=true
     
     }else{
       regvat=false
     }
     
       formData.append('VatRegistered', regvat);
     
    }
    else if(key === 'RegisteredCountryId'|| key === 'TradingCountryId' ){

      formData.append('RegisteredCountryId', String(parseInt(this.addNewGeneratorForm.value?.RegisteredCountryId,10)));
       
      formData.append('TradingCountryId', String(parseInt (this.addNewGeneratorForm.value?.RegisteredCountryId,10)));
       
     }
    
    else {
      formData.append(key, this.addNewGeneratorForm.get(key)?.value);
    }
  });
 

  // Append file if selected
  if (this.selectedFile) {
    formData.append('Profile', this.selectedFile);
  }
  if (this.selectedFile) {
    formData.append('HelpImage', this.HelpImage);
  }

  // Send data to API
  this.http.post(this.apiUrl+'api/Operator/CreateOperator', formData).subscribe(
    response => {
      console.log('Form submitted successfully', response);
      alert('Form saved successfully!');
    },
    error => {
      console.error('Error saving form', error);
      alert('Error saving form. Please try again.');
    }
  );
}

// onSubmit(): void {
//   debugger
//   if (this.addNewGeneratorForm.valid) {
//     console.log('Form Data:', this.addNewGeneratorForm.value);
//   } else {
//     console.log('Form is invalid');
//   }

// }


  onReset(): void {
    this.addNewGeneratorForm.reset();
  }
  cancel() {
    this.router.navigateByUrl('app/operatorconfig/operatordetail');
  }
  
}

