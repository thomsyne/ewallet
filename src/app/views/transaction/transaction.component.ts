import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WalletService } from './../../../services/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  providers: [DatePipe]
})
export class TransactionComponent implements OnInit {

  modalVisible: boolean = false;
  transactionForm!: FormGroup;
  isWalletValid: boolean = false;
  btnText: string = 'Fetch Details'
  transactionList: {
    id: number,
    wallet_id: number,
    first_name: string,
    last_name: string,
    amount: number,
    narration: string,
    created_at: string,
    updated_at: string,
    transaction_type: string,
    sender_name: string,
    receiver_name: string,
  }[] = []

  constructor(
    private readonly toastrService: ToastrService,
    private readonly walletService: WalletService
  ) { }

  ngOnInit() {
    this.buildForm()
    this.fetchTransactions()
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
          this.toastrService.success(`Transfer successful. Your new balance is ${res.senderBalance}`)
          this.transactionForm.reset()

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

  fetchTransactions(){
    this.walletService.fetchTransactions({}).subscribe(
      (res) => {
        if (res.message){
          this.toastrService.info(res.message)
          this.transactionList = res.transactions
        }
      },
      (err) => {
        console.log(err)
        this.toastrService.error(err?.error?.message || 'An error occurred')
      }
    )
  }


  toggleLiveDemo() {
    this.modalVisible = !this.modalVisible;
  }

  handleLiveDemoChange(event: any) {
    this.modalVisible = event;
  }

}
