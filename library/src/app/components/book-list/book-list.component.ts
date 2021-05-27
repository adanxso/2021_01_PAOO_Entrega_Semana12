import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { Book } from '../../interfaces/Book'
import { BookService } from '../../services/BookService'
import { Subscription, Observable } from 'rxjs'

@Component({
  selector: 'book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  public books: Array<Book> = []
  private booksSubscription: Subscription
  public isLoading: boolean = false
  public qtyBooks: number = 10
  public qtyBooksPerPage: number = 2
  public qtyBooksPerPageOptions: Array<Number> = [2, 5, 10]

  constructor(public bookService: BookService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.bookService.getBooks()
    this.booksSubscription = this.bookService
      .getBooksListObservable()
      .subscribe((books: Array<Book>) => {
        this.books = books
        this.isLoading = false
      })
  }

  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe()
  }

  onDelete (bookId) {
    this.bookService.removeBook(bookId)
  }

}
