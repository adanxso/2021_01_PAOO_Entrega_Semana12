import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BookInsertComponent } from './components/book-insert/book-insert.component'
import { BookListComponent } from './components/book-list/book-list.component'

const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'create',
    component: BookInsertComponent
  },
  {
    path: 'edit/:bookId',
    component: BookInsertComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule{

}
