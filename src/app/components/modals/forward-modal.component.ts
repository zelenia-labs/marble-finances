import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { FinanceStore } from '../../store/finance.store';
import { ModalComponent, ModalButton } from './modal.component';

@Component({
  selector: 'app-forward-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forward-modal.component.html',
  host: {
    '(window:keydown.enter)': 'onEnter()',
  },
})
export class ForwardModalComponent {
  store = inject(FinanceStore);

  forwardButtons = computed<ModalButton[]>(() => [
    { label: 'Just Here', type: 'secondary', action: () => this.store.executeForwardAction(undefined, false) },
    { label: 'Apply Forward', type: 'slate', action: () => this.store.executeForwardAction(undefined, true) }
  ]);

  onEnter() {
    if (this.store.forwardTarget()) {
      this.store.executeForwardAction(undefined, true);
    }
  }

  toggleAutoApply(event: Event) {
    const el = event.target as HTMLInputElement;
    this.store.setAutoApplyForward(el.checked);
  }

  close() {
    this.store.cancelForwardUpdate();
  }
}
