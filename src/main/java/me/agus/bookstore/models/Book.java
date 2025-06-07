package me.agus.bookstore.models;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "books")
@Data
@EqualsAndHashCode(callSuper = true)
public class Book extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @Column(nullable = false, length = 255)
    private String title;

    public Book(Long id, String title, String author, String isbn, String publisher, Integer publicationYear, Double price, Integer stock) {
        Id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
        this.publicationYear = publicationYear;
        this.price = price;
        this.stock = stock;
    }

    public Book() {
    }

    @Column(nullable = false, length = 255)
    private String author;
    @Column(unique = true, length = 13)
    private String isbn;
    @Column(length = 255)
    private String publisher;
    @Column(name = "publication_year")
    private Integer publicationYear;
    @Column(nullable = false)
    private Double price;
    @Column(nullable = false)
    private Integer stock;



    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
