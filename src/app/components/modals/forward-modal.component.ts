import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { FinanceStore } from '../../store/finance.store';

@Component({
  selector: 'app-forward-modal',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forward-modal.component.html',
  host: {
    '(window:keydown.enter)': 'onEnter()',
  },
})
export class ForwardModalComponent {
  store = inject(FinanceStore);

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
