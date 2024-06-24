import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/services/authGuard.service';

const routes: Routes = [
  {
    path: 'board/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuardService],
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [BoardComponent],
})
export class BoardModule {}
