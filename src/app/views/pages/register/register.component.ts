import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  //isPasswordMatch = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
    ) {}

  ngOnInit() {
    this.buildForm()
  }

  buildForm(){

    this.registerForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]{2,}$/)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]{2,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^%()|`~#\[\]{}\\\/:;'",<>.+=\-_])[A-Za-z\d@$!%*?&^%()|`~#\[\]{}\\\/:;'",<>.+=\-_]{8,}$/)]),
      confirm_password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^%()|`~#\[\]{}\\\/:;'",<>.+=\-_])[A-Za-z\d@$!%*?&^%()|`~#\[\]{}\\\/:;'",<>.+=\-_]{8,}$/)]),
      role: new FormControl('user', Validators.required),
      account_status: new FormControl('active', Validators.required),
    })
  }

  get isPasswordMatch (){
    return this.registerForm.value.password === this.registerForm.value.confirm_password
  }

  
  register() {

    if(!this.isPasswordMatch){
      this.toastrService.error('Password does not match')
      return
    }
    
    if (this.registerForm.invalid) {
      this.toastrService.error('Form is invalid')
      return
    }
    this.authService.authSignup(this.registerForm.value).subscribe(
      (res) => {
        this.toastrService.success('User registered successfully. You can now login.')
        this.registerForm.reset()
        this.router.navigate(['/login'])
      },
      (err) => {
        this.toastrService.error('User registration failed')
      }
    )

    console.log(this.registerForm.value)
  }

  checkPasswords() {
    let pass = this.registerForm.get('password')?.value;
    let confirmPass = this.registerForm.get('confirm_password')?.value;

    return pass === confirmPass
  }
}

