package com.example.finance.repository;

import com.example.finance.model.Transaction;
import com.example.finance.model.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Find transactions by type (INCOME or EXPENSE)
    List<Transaction> findByType(TransactionType type);
    
    // Find transactions by category
    List<Transaction> findByCategory(String category);
    
    // Find transactions between two dates
    List<Transaction> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find transactions by amount greater than
    List<Transaction> findByAmountGreaterThan(BigDecimal amount);
    
    // Find transactions by amount less than
    List<Transaction> findByAmountLessThan(BigDecimal amount);
    
    // Find transactions containing description (case insensitive)
    List<Transaction> findByDescriptionContainingIgnoreCase(String description);
    
    // Custom query to calculate total income
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = com.example.finance.model.Transaction.TransactionType.INCOME")
    BigDecimal calculateTotalIncome();
    
    // Custom query to calculate total expenses
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = com.example.finance.model.Transaction.TransactionType.EXPENSE")
    BigDecimal calculateTotalExpenses();
    
    // Custom query to calculate balance (income - expenses)
    @Query("SELECT SUM(CASE WHEN t.type = com.example.finance.model.Transaction.TransactionType.INCOME THEN t.amount ELSE -t.amount END) FROM Transaction t")
    BigDecimal calculateBalance();
}
