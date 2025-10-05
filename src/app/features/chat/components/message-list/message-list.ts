import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from '../../../../shared/models';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageListComponent implements OnInit, AfterViewChecked {
  public readonly messages = input.required<ChatMessage[]>();
  public readonly currentUserId = input.required<string>();
  public readonly typingUsers = input.required<string[]>();
  public readonly typingIndicatorText = input.required<string>();

  private shouldScrollToBottom = false;

  @ViewChild('messageContainer', { static: false }) messageContainer!: ElementRef;

  public ngOnInit(): void {
    this.shouldScrollToBottom = true;
  }

  public ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  public formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
