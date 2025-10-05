import { computed, inject, Injectable } from '@angular/core';
import { BroadcastService } from './broadcast.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly _broadcast = inject(BroadcastService);

  public readonly messages = this._broadcast.messages;
  public readonly users = this._broadcast.users;
  public readonly typingUsers = this._broadcast.typingUsers;
  public readonly currentUserInfo = this._broadcast.currentUserInfo;

  public readonly typingIndicatorText = computed(() => {
    const typing = this._broadcast.typingUsers();
    if (typing.length === 0) return '';
    if (typing.length === 1) return `${typing[0]} is typing...`;
    if (typing.length === 2) return `${typing.join(' and ')} are typing...`;
    return `${typing.length} users are typing...`;
  });

  public sendMessage(content: string): void {
    this._broadcast.sendMessage(content);
  }

  public setTyping(isTyping: boolean): void {
    this._broadcast.setTyping(isTyping);
  }

  public clearMessages(): void {
    this._broadcast.clearMessages();
  }
}
