package me.agus.bookstore.controller;

import me.agus.bookstore.models.Transaction;
import me.agus.bookstore.models.enums.TransactionType;
import me.agus.bookstore.services.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTransaction(@RequestBody Map<String, Object> payload) {
        try {
            Long memberId = Long.valueOf(payload.get("memberId").toString());
            Long bookId = Long.valueOf(payload.get("bookId").toString());
            TransactionType type = TransactionType.valueOf(payload.get("transactionType").toString().toUpperCase());
            int quantity = Integer.parseInt(payload.get("quantity").toString());
            LocalDate dueDate = null;
            Object dueDateObj = payload.get("dueDate");

            if (dueDateObj != null && !dueDateObj.toString().trim().isEmpty()) {
                dueDate = LocalDate.parse(dueDateObj.toString());
            }

            Transaction newTransaction = transactionService.createTransaction(memberId, bookId, type, quantity, dueDate);
            return new ResponseEntity<>(newTransaction, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Terjadi kesalahan server: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{transactionId}/return")
    public ResponseEntity<?> processReturn(@PathVariable Long transactionId, @RequestBody Map<String, Object> payload) {
        try {
            LocalDate returnDate = LocalDate.parse(payload.get("returnDate").toString());
            Transaction updatedTransaction = transactionService.processReturn(transactionId, returnDate);
            return ResponseEntity.ok(updatedTransaction);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Terjadi kesalahan server: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        if (transactionService.getTransactionById(id).isPresent()) {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}