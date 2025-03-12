package com.example.finance.service;

import com.example.finance.model.Transaction;
import com.example.finance.model.Transaction.TransactionType;
import com.example.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Create a new transaction
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transaction by ID
    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    // Update an existing transaction
    public Transaction updateTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Delete a transaction
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    // Get transactions by type (INCOME or EXPENSE)
    public List<Transaction> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByType(type);
    }

    // Get transactions by category
    public List<Transaction> getTransactionsByCategory(String category) {
        return transactionRepository.findByCategory(category);
    }

    // Get transactions between two dates
    public List<Transaction> getTransactionsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByDateBetween(startDate, endDate);
    }

    // Get transactions by description (partial match)
    public List<Transaction> getTransactionsByDescription(String description) {
        return transactionRepository.findByDescriptionContainingIgnoreCase(description);
    }

    // Calculate total income
    public BigDecimal calculateTotalIncome() {
        BigDecimal totalIncome = transactionRepository.calculateTotalIncome();
        return totalIncome != null ? totalIncome : BigDecimal.ZERO;
    }

    // Calculate total expenses
    public BigDecimal calculateTotalExpenses() {
        BigDecimal totalExpenses = transactionRepository.calculateTotalExpenses();
        return totalExpenses != null ? totalExpenses : BigDecimal.ZERO;
    }

    // Calculate current balance
    public BigDecimal calculateBalance() {
        BigDecimal balance = transactionRepository.calculateBalance();
        return balance != null ? balance : BigDecimal.ZERO;
    }
}
