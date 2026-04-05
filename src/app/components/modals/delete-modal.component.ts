import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceStore } from '../../store/finance.store';

@Component({
  selector: 'app-delete-modal',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-modal.component.html',
  host: {
    '(window:keydown.enter)': 'onEnter()'
  }
})
export class DeleteModalComponent {
  store = inject(FinanceStore);

  onEnter() {
      if (this.store.isDeleteModalOpen()) {
          this.store.executeDelete();
      }
  }
}
