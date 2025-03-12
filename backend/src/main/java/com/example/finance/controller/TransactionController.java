package com.example.finance.controller;

import com.example.finance.model.Transaction;
import com.example.finance.model.Transaction.TransactionType;
import com.example.finance.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow requests from any origin for development
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Create a new transaction
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.createTransaction(transaction);
        return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
    }

    // Get all transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Get transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        return transaction.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update an existing transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction) {
        Optional<Transaction> existingTransaction = transactionService.getTransactionById(id);
        if (existingTransaction.isPresent()) {
            transaction.setId(id);
            Transaction updatedTransaction = transactionService.updateTransaction(transaction);
            return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        Optional<Transaction> existingTransaction = transactionService.getTransactionById(id);
        if (existingTransaction.isPresent()) {
            transactionService.deleteTransaction(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get transactions by type (INCOME or EXPENSE)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@PathVariable TransactionType type) {
        List<Transaction> transactions = transactionService.getTransactionsByType(type);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Get transactions by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategory(@PathVariable String category) {
        List<Transaction> transactions = transactionService.getTransactionsByCategory(category);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Get transactions between two dates
    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Transaction> transactions = transactionService.getTransactionsBetweenDates(startDate, endDate);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Get transactions by description (partial match)
    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> getTransactionsByDescription(@RequestParam String description) {
        List<Transaction> transactions = transactionService.getTransactionsByDescription(description);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Get financial summary (income, expenses, balance)
    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getFinancialSummary() {
        BigDecimal totalIncome = transactionService.calculateTotalIncome();
        BigDecimal totalExpenses = transactionService.calculateTotalExpenses();
        BigDecimal balance = transactionService.calculateBalance();
        
        Map<String, BigDecimal> summary = Map.of(
            "totalIncome", totalIncome,
            "totalExpenses", totalExpenses,
            "balance", balance
        );
        
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }
}
