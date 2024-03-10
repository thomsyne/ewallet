import { TransactionService } from './../../../services/transaction.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    private readonly transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.fetchTransactions()
  }

  fetchTransactions(){
    this.transactionService.fetchTransactions({}).subscribe(
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
}
