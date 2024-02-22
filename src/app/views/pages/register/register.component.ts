import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    private readonly toastrService: ToastrService
    ) {}

  ngOnInit() {
    this.buildForm()
  }

  buildForm(){

    this.registerForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
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
      this.toastrService.error('Please fill all the required fields')
      return
    }

    this.authService.authSignup(this.registerForm.value).subscribe(
      (res) => {
        this.toastrService.success('User registered successfully')
        this.registerForm.reset()
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

