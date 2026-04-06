import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';

export interface ModalButton {
  label: string;
  type?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'slate';
  action: () => void;
  disabled?: boolean;
}

@Component({
  selector: 'app-modal',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  host: {
    '(window:keydown.escape)': 'onEscape()',
  },
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  description = input<string>('');
  widthClass = input<string>('w-[400px]');
  buttons = input<ModalButton[]>([]);
  dismiss = output<void>();

  // Unique ID for ARIA labeling
  titleId = computed(() => `modal-title-${Math.random().toString(36).substring(2, 9)}`);

  onEscape() {
    if (this.isOpen()) {
      this.dismiss.emit();
    }
  }
}
