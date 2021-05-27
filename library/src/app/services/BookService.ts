import { Injectable } from '@angular/core'
import { Book } from '../interfaces/Book'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class BookService {
  private books: Array<Book> = []
  private bookListUpdate = new Subject<Array<Book>>()

  constructor (private httpBook: HttpClient, private router: Router) {}

  addBook (title, author, pages, image: File): void {
    const form = new FormData()
    form.append('title', title)
    form.append('author', author)
    form.append('pages', pages)
    form.append('image', image)
    this.httpBook
      .post<Book>(
        'http://localhost:3001/api/books',
        form
      )
        .subscribe(data => {
          const book: Book = {
            bookId: data.bookId,
            title,
            author,
            pages,
            imageURL: data.imageURL
          }
          this.books.push(data),
          this.bookListUpdate.next([...this.books])
          this.router.navigate(['/'])
        })
  }

  updateBook (
    bookId: string,
    title: string,
    author: string,
    pages: Number,
    image: File | string,
  ) {
    let book: Book | FormData
    if (typeof image === 'object') {
      book = new FormData()
      book.append('bookId', bookId)
      book.append('title', title)
      book.append('author', author)
      book.append('pages', `${pages}`)
      book.append('image', image, title)
    } else {
      book = {
        bookId,
        title,
        author,
        pages,
        imageURL: image
      }
    }
    this.httpBook
      .put(`http://localhost:3001/api/books/${bookId}`, book)
      .subscribe(res => {
        const copy = [...this.books]
        copy[copy.findIndex(el => el.bookId === bookId)] = {
          bookId, title, author, pages, imageURL: null
        }
        this.books = [...copy]
        this.bookListUpdate.next([...this.books])
        this.router.navigate(['/'])
      })
  }

  getBook (bookId: String) {
    return this.httpBook
      .get<Book>(`http://localhost:3001/api/books/${bookId}`)
  }

  getBooks (): void {
    this.httpBook.get<Array<Book>>('http://localhost:3001/api/books')
      .subscribe(data => {
        this.books = data
        this.bookListUpdate.next([...this.books])
      })
  }

  getBooksListObservable () {
    return this.bookListUpdate.asObservable()
  }

  removeBook (bookId) {
    this.httpBook
      .delete(`http://localhost:3001/api/books/${bookId}`)
      .subscribe(() => {
        this.books = this.books
          .filter(el => el.bookId !== bookId)
        this.bookListUpdate.next([...this.books])
      })
  }
}
