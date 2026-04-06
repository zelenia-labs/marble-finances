import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { FinanceStore } from '../../store/finance.store';
import { ModalComponent, ModalButton } from './modal.component';

@Component({
  selector: 'app-delete-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-modal.component.html',
  host: {
    '(window:keydown.enter)': 'onEnter()',
  },
})
export class DeleteModalComponent {
  store = inject(FinanceStore);

  deleteButtons = computed<ModalButton[]>(() => [
    { label: 'Cancel', type: 'secondary', action: () => this.store.closeDeleteModal() },
    { label: 'Delete', type: 'danger', action: () => this.store.executeDelete() }
  ]);

  onEnter() {
    if (this.store.isDeleteModalOpen()) {
      this.store.executeDelete();
    }
  }
}
