package me.agus.bookstore.services;

import me.agus.bookstore.models.Book;
import me.agus.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id){
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book){
        return bookRepository.save(book);
    }

    public void deleteBook(Long id){
        bookRepository.deleteById(id);
    }

    public boolean updateBookStock(Long bookId, int quantityChange){
        Optional<Book> optionalBook = bookRepository.findById(bookId);
        if (optionalBook.isPresent()){
            Book book = optionalBook.get();
            int newStock = book.getStock() + quantityChange;
            if (newStock < 0) {
                throw new IllegalArgumentException("Stock cannot be negative.");
            }
            book.setStock(newStock);
            bookRepository.save(book);
            return true;
        } else {
            return false;
        }
    }
}
