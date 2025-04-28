import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  
  dailyExpenses: number = 0;
  weeklyExpenses: number = 0;
  monthlyExpenses: number = 0;
  yearlyExpenses: number = 0;
  
  recentTransactions: Transaction[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadFinancialSummary();
    this.loadRecentTransactions();
    this.loadPeriodExpenses();
  }

  loadFinancialSummary(): void {
    this.transactionService.getFinancialSummary().subscribe({
      next: (summary) => {
        this.totalIncome = summary.totalIncome;
        this.totalExpenses = summary.totalExpenses;
        this.balance = summary.balance;
      },
      error: (err) => {
        this.error = 'Failed to load financial summary';
        console.error(err);
      }
    });
  }

  loadRecentTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recent transactions';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadPeriodExpenses(): void {
    const today = new Date();
    
    // Calculate date ranges
    const dayStart = new Date(today);
    dayStart.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);
    
    // Format dates for API
    const formatDate = (date: Date) => date.toISOString();
    const nowFormatted = formatDate(today);
    
    // Get daily expenses
    this.transactionService.getTransactionsBetweenDates(
      formatDate(dayStart), 
      nowFormatted
    ).subscribe(transactions => {
      this.dailyExpenses = this.calculateTotalExpenses(transactions);
    });
    
    // Get weekly expenses
    this.transactionService.getTransactionsBetweenDates(
      formatDate(weekStart), 
      nowFormatted
    ).subscribe(transactions => {
      this.weeklyExpenses = this.calculateTotalExpenses(transactions);
    });
    
    // Get monthly expenses
    this.transactionService.getTransactionsBetweenDates(
      formatDate(monthStart), 
      nowFormatted
    ).subscribe(transactions => {
      this.monthlyExpenses = this.calculateTotalExpenses(transactions);
    });
    
    // Get yearly expenses
    this.transactionService.getTransactionsBetweenDates(
      formatDate(yearStart), 
      nowFormatted
    ).subscribe(transactions => {
      this.yearlyExpenses = this.calculateTotalExpenses(transactions);
    });
  }

  private calculateTotalExpenses(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }
}
