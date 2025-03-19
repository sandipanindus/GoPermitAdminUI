import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-uploadlogo',
  templateUrl: './uploadlogo.component.html',
  styleUrls: ['./uploadlogo.component.scss']
})
export class UploadlogoComponent implements OnInit {
  imageUrl: string | ArrayBuffer | null = null;

  logo: string;
  fileUrls: { [key: string]: string | null } = {};
  // isDragging: { [key: string]: boolean } = {};

  
  constructor( private authService: AuthService,private notifications: NotificationsService,
    private translate: TranslateService) { }

    userId
  ngOnInit(): void {
    debugger
    this.userId=localStorage.getItem("LoginId")

    this.getOperatorById()
  }


     onSuccess(msg) {
      debugger
          this.notifications.create(this.translate.instant('Success'),
              this.translate.instant(msg), NotificationType.Success,
              { timeOut: 3000, showProgressBar: true });
      }
      error(msg) {
          this.notifications.create(this.translate.instant('Error'),
              this.translate.instant(msg), NotificationType.Error, {
              timeOut: 3000,
              showProgressBar: true
          });
      }
      alert(msg) {
          this.notifications.create(this.translate.instant('Alert'),
              this.translate.instant(msg), NotificationType.Alert, {
              timeOut: 3000,
              showProgressBar: true
          });
      }
  

  // onFileSelected(event: Event): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //           if (!file.type.startsWith('image/')) {
  //             alert('Please upload a valid image file.');
  //             return;
  //           }
      
  //           const reader = new FileReader();
  //           reader.onload = () => {
  //             this.imageUrl = reader.result;
  //           };
  //           reader.readAsDataURL(file);
  //         }
  // }

  selectedFile
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
  
      // Validate file type (ensure it's an image)
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result; // Preview image
      };
      reader.readAsDataURL(file);
  
      // Store the selected file for API call
      this.selectedFile = file;
    }
  }

  SaveLogo(): void {
    debugger
    if (!this.selectedFile) {
      this.alert('Please select an image file first.');
     // alert('Please select an image file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('Id', this.userId);  // Append Id as a string
    formData.append('fileUpload', this.selectedFile);  // Append file


  
  this.authService.SaveOperatorUserLogo(formData).subscribe((resp:any)=>{
  if (resp.status == "200") {
    this.onSuccess('Logo Saved Successfully');
  }
  else {
    this.alert(resp.message);

  }
  },err=>{
    this.alert(err.error.message);
  })
    //     console.log('Logo uploaded successfully:', response);
    //     alert('Logo uploaded successfully!');
    //   },
    //   error: (error) => {
    //     console.error('Error uploading logo:', error);
    //     alert('Failed to upload logo.');
    //   }
    // });
  }


  getOperatorById(){
    debugger
    this.authService.GetUsersById(this.userId).subscribe((result: any) => {
      var finalresult = JSON.parse(result);
      finalresult.result.operatorLogo

      if (finalresult && finalresult.result && finalresult.result.operatorLogo) {
        // Assuming 'operatorLogo' contains the logo URL or base64 string
        this.imageUrl = this.authService.imageBindUrl+finalresult.result.operatorLogo;
      } else {
        this.imageUrl = '';  // Clear if no logo is found
      }

      console.log("ImageUrl",this.imageUrl)
    });
  }

}
