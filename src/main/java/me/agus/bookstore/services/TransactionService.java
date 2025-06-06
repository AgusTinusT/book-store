package me.agus.bookstore.services;

import me.agus.bookstore.models.Book;
import me.agus.bookstore.models.Member;
import me.agus.bookstore.models.Transaction;
import me.agus.bookstore.models.enums.TransactionStatus;
import me.agus.bookstore.models.enums.TransactionType;
import me.agus.bookstore.repository.BookRepository;
import me.agus.bookstore.repository.MemberRepository;
import me.agus.bookstore.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    private BookRepository bookRepository;

    private MemberRepository memberRepository;

    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions(){
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id){
        return transactionRepository.findById(id);
    }

    public Transaction createTransaction(Long memberId, Long bookId, TransactionType transactionType, int quantity, LocalDate dueDate){
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        Optional<Book> bookOptional = bookRepository.findById(bookId);

        if (memberOptional.isEmpty()){
            throw new IllegalArgumentException("Member with ID " + memberId + " not found");
        }
        if (bookOptional.isEmpty()){
            throw new IllegalArgumentException("Book with ID " + bookId + " not found");
        }

        Member member = memberOptional.get();
        Book book = bookOptional.get();

        if (transactionType == TransactionType.PEMBELIAN || transactionType == TransactionType.PEMINJAMAN){
            if (book.getStock() < quantity){
                throw new IllegalArgumentException("Stok buku " + book.getTitle() + " tidak mencukup untuk " + quantity + " unit" );
            }

            book.setStock(book.getStock() - quantity);
            bookRepository.save(book);
        }

        Transaction transaction = new Transaction();
        transaction.setMember(member);
        transaction.setBook(book);
        transaction.setTransactionType(transactionType);
        transaction.setQuantity(quantity);
        transaction.setTransactionDate(LocalDateTime.now());

        if (transactionType == TransactionType.PEMBELIAN){
            transaction.setTotalAmount(book.getPrice() * quantity);
            transaction.setTransactionStatus(TransactionStatus.SELESAI);
        } else if (transactionType == TransactionType.PEMINJAMAN){
            if (dueDate == null) {
                throw new IllegalArgumentException("Tangal jatuh tempo harus diisi untuk peminjaman");
            }
            transaction.setDueDate(dueDate);
            transaction.setTransactionStatus(TransactionStatus.TERTUNDA);
        } else {
            throw new IllegalArgumentException("Tipe transaksi tidak valid");
        }

        return transactionRepository.save(transaction);
    }

    public Transaction processReturn(Long transactionId, LocalDate returnDate){
        Optional<Transaction> transactionOptional = transactionRepository.findById(transactionId);
        if (transactionOptional.isEmpty()){
            throw new IllegalArgumentException("Transaction with ID " + transactionId + " not found");
        }

        Transaction transaction = transactionOptional.get();

        if (transaction.getTransactionStatus() == TransactionStatus.SELESAI || transaction.getTransactionStatus() == TransactionStatus.BATAL) {
            throw new IllegalArgumentException("Transaksi ini bukan peminjaman dan tidak dapat dikembalikan.");
        }
        if (transaction.getTransactionType() == TransactionType.PEMINJAMAN){
            throw new IllegalArgumentException("Peminjaman ini sudah selesai atau dibatalkan.");
        }

        Book book = transaction.getBook();
        book.setStock(book.getStock() + transaction.getQuantity());
        bookRepository.save(book);

        transaction.setReturnDate(returnDate);
        transaction.setTransactionStatus(TransactionStatus.SELESAI);

        if (transaction.getDueDate() != null && returnDate.isAfter(transaction.getDueDate())) {
            transaction.setTransactionStatus(TransactionStatus.TERLAMBAT);
        }

        return transactionRepository.save(transaction);
    }


    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
