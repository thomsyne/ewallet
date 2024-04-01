import { WalletService } from './../../../services/wallet.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  modalVisible: boolean = false;
  transactionForm!: FormGroup;
  fundForm!: FormGroup;
  isWalletValid: boolean = false;
  btnText: string = 'Fetch Details'

  constructor(
    private readonly walletService: WalletService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.buildFundForm()
    this.buildForm()
  }

  buildFundForm(){
    this.fundForm = new FormGroup({
      cardNo: new FormControl('', [Validators.required, Validators.maxLength(19), Validators.minLength(19)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      expDate: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      cvv: new FormControl('', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]),
      amount: new FormControl(0.00, [Validators.required]),
    })
  }

  buildForm(){
    this.transactionForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      wallet_id: new FormControl(0, [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),
      radio: new FormControl('email', Validators.required),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      amount: new FormControl(0.00, [Validators.required]),
      narration: new FormControl(''),
    })
  }

  formatCardNumber(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let formattedValue = inputElement.value.replace(/\s+/g, ''); // Remove existing spaces

    // Add space after every 4 characters
    formattedValue = formattedValue.replace(/(.{4})/g, '$1 ').trim();

    // Update the input value
    inputElement.value = formattedValue;
    this.fundForm.patchValue({
      cardNo: formattedValue
    }); // Update the form control value
  }

  fundWallet(){
    this.walletService.fundWallet(this.fundForm.value).subscribe(
      (res) => {
        if (res.message) {
          this.toastrService.success(res.message + '. Your new balance is $' + res.newBalance)
          this.fundForm.reset()
          this.router.navigate(['/transactions'])
        }
      },
      (err) => {
        console.log(err)
        this.toastrService.error(err?.error?.message || 'An error occurred')
      }
    )
  }

  checkValues(){

    const expDate = this.fundForm.value.expDate;
    const month = expDate.slice(0, 2);
    const year = expDate.slice(2);

    const currentDate = new Date();
    const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const currentYear = currentDate.getFullYear().toString().slice(-2);

    if (Number(month) < 1 || Number(month) > 12) {
      this.toastrService.error('Invalid month')
      return
    }

    if (Number(year) < 0 || Number(year) > 99) {
      this.toastrService.error('Invalid year')
      return
    }
    
    if (Number(year) < Number(currentYear)) {
      this.toastrService.error('Card has expired')
      return
    }

    if (Number(year) >= Number(currentYear) && Number(month) < Number(currentMonth)) {
      this.toastrService.error('Card has expired')
      return
    }

    if (this.fundForm.value.amount <= 0) {
      this.toastrService.error('Amount must be greater than 0')
      return
    }

    if (this.fundForm.value.amount > 5000) {
      this.toastrService.error('Amount must not be greater than $5000')
      return
    }

    if (this.fundForm.invalid) {
      this.toastrService.error('Please fill in all required fields')
      return
    }

    this.fundWallet()
  }

  fetchRecipientDetails(){
    this.walletService.getDetails(this.transactionForm.value).subscribe(
      (res) => {
        if (res.id) {
          this.toastrService.success('Recipient details fetched successfully')
          this.isWalletValid = true;
          this.btnText = 'Transfer Funds'
          this.resolveValues(res)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  
  }

  transferFunds(){

    if (this.transactionForm.value.amount <= 0) {
      this.toastrService.error('Amount must be greater than 0')
      return
    }

    if (!this.transactionForm.value.narration) {
      this.toastrService.info('Proceeding without narration...')
    }

    let form = {
      recipient_wallet: this.transactionForm.value.wallet_id,
      amount: this.transactionForm.value.amount,
      narration: this.transactionForm.value.narration
    }

    console.log(form)

    this.walletService.transferFunds(form).subscribe(
      (res) => {
        if (res.transactionData) {
          this.toastrService.success(`Transfer successful. Your new balance is $${res.senderBalance}`)
          this.transactionForm.reset()
          this.transactionForm.controls['radio'].enable()
          this.transactionForm.patchValue({
            radio: 'email'
          })

          this.isWalletValid = false;
          this.btnText = 'Fetch Details'
          this.modalVisible = false;
        }
      },
      (err) => {
        console.log(err)
        this.toastrService.error(err?.error?.message || 'An error occurred')
      }
    )
  }

  resolveValues(res: any){
    this.transactionForm.controls['radio'].disable()

    this.transactionForm.patchValue({
      wallet_id: res.id,
      email: res.email,
      first_name: res.first_name,
      last_name: res.last_name,
      radio: ''
    })
  }

  resetModal(){
    this.transactionForm.controls['radio'].enable()
    this.transactionForm.patchValue({
      email: '',
      wallet_id: 0,
      radio: 'email',
      first_name: '',
      last_name: '',
      amount: 0.00,
      narration: '',
    })
    this.isWalletValid = false;
    this.btnText = 'Fetch Details'
  }

  toggleLiveDemo() {
    this.modalVisible = !this.modalVisible;
  }

  handleLiveDemoChange(event: any) {
    this.modalVisible = event;
  }

}
