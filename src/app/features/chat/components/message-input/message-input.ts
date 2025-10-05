import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss',
})
export class MessageInputComponent {
  private _typingTimeout?: number;

  public readonly messageSent = output<string>();
  public readonly typingChanged = output<boolean>();

  public readonly messageText = signal('');
  public readonly isTyping = signal(false);
  public readonly isDisabled = signal(false);
  public readonly canSend = signal(false);
  public readonly characterCount = signal(0);

  @ViewChild('messageTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  constructor() {
    this.setUpEffects();
  }

  public onInput(): void {
    this.adjustTextareaHeight();
    this.handleTyping();
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  public onFocus(): void {
    this.handleTyping();
  }

  public onBlur(): void {
    this.stopTyping();
  }

  public sendMessage(): void {
    const text = this.messageText().trim();

    if (!text || this.isDisabled()) return;

    this.messageSent.emit(text);
    this.messageText.set('');
    this.adjustTextareaHeight();
    this.stopTyping();

    setTimeout(() => {
      this.textarea?.nativeElement.focus();
    }, 0);
  }

  private setUpEffects(): void {
    effect(() => {
      const text = this.messageText().trim();
      this.canSend.set(text.length > 0 && !this.isDisabled());
    });

    effect(() => {
      this.characterCount.set(this.messageText().length);
    });
  }

  private adjustTextareaHeight(): void {
    if (!this.textarea) return;

    const textarea = this.textarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  private handleTyping(): void {
    if (this.isDisabled()) return;

    this.isTyping.set(true);
    this.typingChanged.emit(true);

    if (this._typingTimeout) {
      clearTimeout(this._typingTimeout);
    }

    this._typingTimeout = window.setTimeout(() => {
      this.stopTyping();
    }, 2000);
  }

  private stopTyping(): void {
    if (this.isTyping()) {
      this.isTyping.set(false);
      this.typingChanged.emit(false);
    }

    if (this._typingTimeout) {
      clearTimeout(this._typingTimeout);
      this._typingTimeout = undefined;
    }
  }

  // Public method to disable/enable input
  setDisabled(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  // Public method to clear input
  clear(): void {
    this.messageText.set('');
    this.stopTyping();
    this.adjustTextareaHeight();
  }

  // Public method to focus input
  focus(): void {
    setTimeout(() => {
      this.textarea?.nativeElement.focus();
    }, 0);
  }
}
