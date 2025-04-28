import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Filter options
  filterType: string = 'all';
  searchTerm: string = '';
  
  // Sort options
  sortField: 'date' | 'amount' | 'description' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.transactions];
    
    // Apply type filter
    if (this.filterType !== 'all') {
      result = result.filter(t => t.type === this.filterType);
    }
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (this.sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (this.sortField === 'description') {
        comparison = a.description.localeCompare(b.description);
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.filteredTransactions = result;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(field: 'date' | 'amount' | 'description'): void {
    if (this.sortField === field) {
      // Toggle direction if clicking the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc'; // Default to descending for new sort field
    }
    
    this.applyFilters();
  }

  getSortIndicator(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  deleteTransaction(id: number | undefined): void {
    if (!id) {
      this.error = 'Cannot delete transaction: Invalid ID';
      return;
    }
    
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(t => t.id !== id);
          this.applyFilters();
        },
        error: (err) => {
          this.error = 'Failed to delete transaction';
          console.error(err);
        }
      });
    }
  }
}
