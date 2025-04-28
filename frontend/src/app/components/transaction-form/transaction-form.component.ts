import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  isEditMode = false;
  transactionId: number | null = null;
  loading = false;
  error: string | null = null;
  transactionTypes = Object.values(TransactionType);
  
  // Common categories for transactions
  categories = [
    'Food & Dining', 
    'Shopping', 
    'Housing', 
    'Transportation', 
    'Entertainment', 
    'Healthcare', 
    'Education', 
    'Utilities', 
    'Travel', 
    'Gifts & Donations',
    'Salary',
    'Investment',
    'Other Income'
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      category: ['', Validators.required],
      type: [TransactionType.EXPENSE, Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID in the route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.transactionId = +params['id'];
        this.loadTransaction(this.transactionId);
      } else {
        // Set default date to today for new transactions
        const today = new Date();
        const formattedDate = today.toISOString().substring(0, 16); // Format: YYYY-MM-DDTHH:MM
        this.transactionForm.patchValue({ date: formattedDate });
      }
    });
  }

  loadTransaction(id: number): void {
    this.loading = true;
    this.transactionService.getTransactionById(id).subscribe({
      next: (transaction) => {
        // Format the date to be compatible with the datetime-local input
        const formattedDate = new Date(transaction.date).toISOString().substring(0, 16);
        
        this.transactionForm.patchValue({
          description: transaction.description,
          amount: transaction.amount,
          date: formattedDate,
          category: transaction.category,
          type: transaction.type
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transaction';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.transactionForm.controls).forEach(key => {
        const control = this.transactionForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    
    // Create transaction object from form values
    const transactionData: Transaction = {
      ...this.transactionForm.value,
      // Ensure date is in ISO format
      date: new Date(this.transactionForm.value.date).toISOString()
    };

    // If in edit mode, update existing transaction, otherwise create new one
    if (this.isEditMode && this.transactionId) {
      transactionData.id = this.transactionId;
      this.transactionService.updateTransaction(transactionData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          this.error = 'Failed to update transaction';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.transactionService.createTransaction(transactionData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          this.error = 'Failed to create transaction';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  // Helper method to check if a form control is invalid and touched
  isInvalid(controlName: string): boolean {
    const control = this.transactionForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Helper method to get error message for a form control
  getErrorMessage(controlName: string): string {
    const control = this.transactionForm.get(controlName);
    
    if (!control) return '';
    
    if (control.errors?.['required']) {
      return 'This field is required';
    }
    
    if (control.errors?.['min']) {
      return 'Value must be greater than 0';
    }
    
    if (control.errors?.['maxlength']) {
      return 'Value is too long';
    }
    
    return 'Invalid value';
  }
}
