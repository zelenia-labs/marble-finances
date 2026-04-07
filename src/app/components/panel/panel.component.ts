import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

@Component({
  selector: 'app-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <nav
      class="fixed top-0 bottom-0 bg-white/94 backdrop-blur-xl flex flex-col z-100 transition-all duration-300 ease-out"
      [class.left-0]="position() === 'left'"
      [class.right-0]="position() === 'right'"
      [class.border-r]="position() === 'left'"
      [class.border-l]="position() === 'right'"
      [class.border-gray-100]="true"
      [style.width]="width()"
      [style.transform]="isOpen() ? 'translateX(0)' : (position() === 'left' ? 'translateX(-100%)' : 'translateX(100%)')"
      [style.box-shadow]="position() === 'left' ? '20px 0 40px rgba(0,0,0,0.05)' : '-20px 0 40px rgba(0,0,0,0.05)'"
      (click)="$event.stopPropagation()"
      (keydown)="$event.stopPropagation()"
      [attr.aria-hidden]="!isOpen()"
      [attr.aria-label]="ariaLabel()"
      tabindex="-1"
    >
      <!-- Main Scrollable Content -->
      <div class="flex-1 overflow-y-auto px-9 pt-[120px] pb-6 custom-scrollbar">
        <ng-content></ng-content>
      </div>

      <!-- Optional Footer (Sticky at bottom) -->
      <div class="px-9 pb-10">
        <ng-content select="[footer]"></ng-content>
      </div>
    </nav>
  `,
  styles: `
    .custom-scrollbar::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
  `,
})
export class PanelComponent {
  isOpen = input<boolean>(false);
  position = input<'left' | 'right'>('left');
  width = input<string>('320px');
  ariaLabel = input<string>('Panel');
}




