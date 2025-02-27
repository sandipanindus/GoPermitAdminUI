
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';




@Component({
  selector: 'app-page-password',
  templateUrl: './page-password.component.html',
  styleUrls: ['./page-password.component.scss'],
})
export class PagePasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  passwordRequirementsVisible: boolean = false;
  passwordMismatchVisible: boolean = false;
  passwordUpdated: boolean = false;
  canSubmit: boolean = false; // Controls button state


  loginId: number | null = null; // Variable to store the LoginId


  constructor(private authService: AuthService, private notifications: NotificationsService) {}


  showNewPassword: boolean = false;
showConfirmPassword: boolean = false;

// Toggle visibility for New Password field
toggleNewPasswordVisibility(): void {
  this.showNewPassword = !this.showNewPassword;
}

// Toggle visibility for Confirm Password field
toggleConfirmPasswordVisibility(): void {
  this.showConfirmPassword = !this.showConfirmPassword;
}


  ngOnInit(): void {
    this.updateSubmitState();

    this.getLoginId(); // Call the method on component initialization
  }

   // Method to extract and store LoginId from localStorage
   getLoginId(): void {
    const storedLoginId = localStorage.getItem('LoginId');
    this.loginId = storedLoginId ? parseInt(storedLoginId, 10) : null;
    console.log('Extracted LoginId:', this.loginId); // Log the extracted ID
  }

  // Checks password requirements in real-time
  onNewPasswordInput(): void {
    this.passwordRequirementsVisible = !this.validatePassword(this.newPassword);
    this.updateSubmitState();
  }

  // Checks password match in real-time
  onConfirmPasswordInput(): void {
    this.passwordMismatchVisible = this.confirmPassword !== this.newPassword;
    this.updateSubmitState();
  }

  // Validates password strength
  validatePassword(password: string): boolean {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 6;

    return hasSpecialChar && hasLowerCase && hasUpperCase && hasNumber && isLongEnough;
  }

  // Updates the submit button state
  updateSubmitState(): void {
    const isPasswordValid = this.validatePassword(this.newPassword);
    const doPasswordsMatch = this.newPassword === this.confirmPassword;
    this.canSubmit = isPasswordValid && doPasswordsMatch;
  }

  // Handles form submission
 // 📝 Updated onSubmit with API call
 onSubmit(): void {
  this.onNewPasswordInput();
  this.onConfirmPasswordInput();

  if (this.canSubmit && this.loginId !== null) {
    this.authService.changePassword(this.newPassword, this.loginId).subscribe({
      next: (response) => {
        console.log('Password change successful:', response);
        this.passwordUpdated = true;
        this.notifications.success('Success', 'Password changed successfully!', {
          timeOut: 3000, // Auto-closes after 3 seconds
          showProgressBar: true,
          clickToClose: true,
          pauseOnHover: true,
          theClass: 'outline primary',
        });
        
        this.onOkClick(); // Clear input fields after success
      },
      error: (error) => {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please try again.');
      },
    });
  } else {
    alert('Invalid input or missing LoginId.');
  }
}

  // Resets form after successful password change
  onOkClick(): void {
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordUpdated = false;
    this.passwordRequirementsVisible = false;
    this.passwordMismatchVisible = false;
    this.canSubmit = false;
  }
}
