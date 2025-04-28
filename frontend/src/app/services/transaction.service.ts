import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, TransactionType } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) { }

  // Get all transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // Get transaction by ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Create a new transaction
  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // Update an existing transaction
  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  // Delete a transaction
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get transactions by type (INCOME or EXPENSE)
  getTransactionsByType(type: TransactionType): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/type/${type}`);
  }

  // Get transactions by category
  getTransactionsByCategory(category: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/category/${category}`);
  }

  // Get transactions between two dates
  getTransactionsBetweenDates(startDate: string, endDate: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get transactions by description (partial match)
  getTransactionsByDescription(description: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/search?description=${description}`);
  }

  // Get financial summary (income, expenses, balance)
  getFinancialSummary(): Observable<{totalIncome: number, totalExpenses: number, balance: number}> {
    return this.http.get<{totalIncome: number, totalExpenses: number, balance: number}>(`${this.apiUrl}/summary`);
  }
}
