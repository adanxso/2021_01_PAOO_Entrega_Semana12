import {
  Component,
  OnInit
} from '@angular/core'
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Book } from 'src/app/interfaces/Book'
import { BookService } from '../../services/BookService'
import { mimeTypeValidator } from './mime-type.validator'
@Component({
  selector: 'book-insert',
  templateUrl: './book-insert.component.html',
  styleUrls: ['./book-insert.component.css']
})
export class BookInsertComponent implements OnInit {

  public form: FormGroup
  private mode: string = 'create'
  private bookId: string
  public book: Book
  public isLoading: boolean = false
  public previewImage: string

  constructor(
    public bookService: BookService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      }),
      author: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      pages: new FormControl(null, {
        validators: [Validators.required]
      })
    })
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        this.isLoading = true
        if (paramMap.has('bookId')){
          this.mode = 'edit'
          this.bookId = paramMap.get('bookId')
          this.bookService.getBook(this.bookId)
            .subscribe(book => {
              this.book = { ...book }
              this.form.setValue({
                title: this.book.title,
                author: this.book.author,
                pages: this.book.pages,
                image: this.book.imageURL
              })
            })
        } else {
          this.mode = 'create'
          this.bookId = null
        }
        this.isLoading = false
      }
    )
  }

  onSubmit () {
    if (this.form.invalid) {
      return
    }
    if (this.mode === 'create') {
      this.bookService.addBook(
        this.form.value.title,
        this.form.value.author,
        this.form.value.pages,
        this.form.value.image
      )
    } else {
      this.bookService.updateBook(
        this.bookId,
        this.form.value.title,
        this.form.value.author,
        this.form.value.pages,
        this.form.value.image
      )
    }
    this.form.reset()
  }

  onImageSelected (event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => {
      this.previewImage = reader.result as string
    }
    reader.readAsDataURL(file)
  }

}
