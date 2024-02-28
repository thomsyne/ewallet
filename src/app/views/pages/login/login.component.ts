import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  //isPasswordMatch = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService,
    private readonly router: Router
    ) {}

  ngOnInit() {
    this.buildForm()
  }

  buildForm(){

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^%()|`~#\[\]{}\\\/:;'",<>.+=\-_])[A-Za-z\d@$!%*?&^%()|`~#\[\]{}\\\/:;'",<>.+=\-_]{8,}$/)]),
    })
  }
  
  login() {
    
    if (this.loginForm.invalid) {
      this.toastrService.error('Form is invalid')
      return
    }
    this.authService.authLogin(this.loginForm.value).subscribe(
      (res) => {
        this.toastrService.success('Login Successful')
        this.loginForm.reset()
        this.router.navigate(['/dashboard'])

        localStorage.setItem('user', JSON.stringify(res))

      },
      (err) => {
        this.toastrService.error('Login failed')
      }
    )
  }

}
