export class LoginDto {
    public Email:string;
    public Password:string;

    constructor(Email, Password)
    {
        this.Email = Email;
        this.Password = Password;
    }
}
