import { computed, inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import {
  CHANNEL_NAME,
  TAB_COUNTER_KEY,
  TAB_ID_KEY,
  TAB_NUMBER_KEY,
  USER_ID_KEY,
} from '@shared/constants';
import { ChatEvent, ChatMessage, TypingEvent, User } from '@shared/models';
import { LOCAL_STORAGE, SESSION_STORAGE, WINDOW as WINDOW_TOKEN } from '@shared/tokens';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private readonly CHANNEL_NAME = CHANNEL_NAME;
  private readonly TAB_ID_KEY = TAB_ID_KEY;
  private readonly USER_ID_KEY = USER_ID_KEY;
  private readonly TAB_COUNTER_KEY = TAB_COUNTER_KEY;
  private readonly TAB_NUMBER_KEY = TAB_NUMBER_KEY;

  private readonly _ngZone = inject(NgZone);
  private readonly _window = inject(WINDOW_TOKEN);
  private readonly _localStorage = inject(LOCAL_STORAGE);
  private readonly _sessionStorage = inject(SESSION_STORAGE);

  private _messages = signal<ChatMessage[]>([]);
  private _users = signal<User[]>([]);
  private _typingUsers = signal<string[]>([]);

  public readonly messages = computed(() => this._messages());
  public readonly currentUserInfo = computed(() => this.currentUser);
  public readonly users = computed(() => this._users());
  public readonly typingUsers = computed(() => this._typingUsers());
  public readonly typingIndicatorText = computed(() => {
    const typing = this._typingUsers();

    if (typing.length === 0) return '';
    if (typing.length === 1) return `${typing[0]} is typing...`;
    if (typing.length === 2) return `${typing.join(' and ')} are typing...`;
    return `${typing.length} users are typing...`;
  });

  private broadcastChannel?: BroadcastChannel;
  private currentUser!: User;
  private tabNumber!: number;

  constructor() {
    this.initializeUser();
    this.initializeBroadcastChannel();
    this.setupEffects();
  }

  public sendMessage(content: string): void {
    if (!content.trim()) return;

    const message: ChatMessage = {
      id: this.generateTabId(),
      content: content.trim(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      timestamp: new Date(),
      tabId: this.currentUser.tabId,
    };

    this._messages.update(messages => [...messages, message]);

    this.broadcastMessage({
      type: 'message',
      data: message,
    });
  }

  public setTyping(isTyping: boolean): void {
    if (this.currentUser.isTyping === isTyping) return;

    this.currentUser.isTyping = isTyping;

    const typingEvent: TypingEvent = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      isTyping,
      timestamp: new Date(),
    };

    this.broadcastMessage({
      type: 'typing',
      data: typingEvent,
    });
  }

  public clearMessages(): void {
    this._messages.set([]);
  }

  public ngOnDestroy(): void {
    if (this.broadcastChannel) {
      this.broadcastMessage({
        type: 'user_leave',
        data: this.currentUser,
      });
      this.broadcastChannel.close();
    }
    this.cleanupTabNumber();
  }

  private initializeUser(): void {
    const session = this._sessionStorage;
    let tabId = session?.getItem(this.TAB_ID_KEY) ?? undefined;
    let userId = session?.getItem(this.USER_ID_KEY) ?? undefined;
    let existingTabNumber = session?.getItem(this.TAB_NUMBER_KEY) ?? undefined;

    if (existingTabNumber) {
      this.tabNumber = parseInt(existingTabNumber, 10);
    } else {
      this.tabNumber = this.getNextTabNumber();
      try {
        session?.setItem(this.TAB_NUMBER_KEY, this.tabNumber.toString());
      } catch {}
    }

    if (!tabId) {
      tabId = this.generateTabId();
      try {
        session?.setItem(this.TAB_ID_KEY, tabId);
      } catch {}
    }

    if (!userId) {
      userId = this.generateUserId();
      try {
        session?.setItem(this.USER_ID_KEY, userId);
      } catch {}
    }

    this.currentUser = {
      id: userId,
      name: `Tab №${this.tabNumber}`,
      tabId,
      isTyping: false,
    };

    this._users.update(users => [...users, this.currentUser]);
  }

  private initializeBroadcastChannel(): void {
    this.broadcastChannel = new BroadcastChannel(this.CHANNEL_NAME);

    this.broadcastChannel.onmessage = (event: MessageEvent<ChatEvent>) => {
      this.handleBroadcastMessage(event.data);
    };

    this.broadcastMessage({
      type: 'user_join',
      data: this.currentUser,
    });
  }

  private setupEffects(): void {
    if (this._window) {
      this._window.addEventListener('beforeunload', () => {
        this.cleanupTabNumber();
        if (this.broadcastChannel) {
          this.broadcastMessage({
            type: 'user_leave',
            data: this.currentUser,
          });
        }
      });
    }
  }

  private generateTabId(): string {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNextTabNumber(): number {
    try {
      const currentCounter = this._localStorage?.getItem(this.TAB_COUNTER_KEY) ?? null;
      const nextNumber = currentCounter ? parseInt(currentCounter, 10) + 1 : 1;

      this._localStorage?.setItem(this.TAB_COUNTER_KEY, nextNumber.toString());

      return nextNumber;
    } catch (error) {
      console.warn('localStorage not available, using fallback tab numbering');
      return Date.now() % 1000;
    }
  }

  private cleanupTabNumber(): void {
    try {
      this._sessionStorage?.removeItem(this.TAB_NUMBER_KEY);
    } catch (error) {
      console.warn('Failed to cleanup tab number:', error);
    }
  }

  private broadcastMessage(event: ChatEvent): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(event);
    }
  }

  private handleBroadcastMessage(event: ChatEvent): void {
    const { type, data } = event;

    switch (type) {
      case 'message':
        this.handleNewMessage(data as ChatMessage);
        break;
      case 'typing':
        this.handleTypingEvent(data as TypingEvent);
        break;
      case 'user_join':
        this.handleUserJoin(data as User);
        break;
      case 'user_leave':
        this.handleUserLeave(data as User);
        break;
    }
  }

  private handleNewMessage(message: ChatMessage): void {
    if (message.userId !== this.currentUser.id) {
      this._messages.update(messages => [...messages, message]);
    }
  }

  private handleTypingEvent(typingEvent: TypingEvent): void {
    if (typingEvent.userId === this.currentUser.id) {
      return;
    }

    this._ngZone.run(() => {
      setTimeout(() => {
        this._typingUsers.update(typingUsers => {
          const filtered = typingUsers.filter(user => user !== typingEvent.userName);
          return typingEvent.isTyping ? [...filtered, typingEvent.userName] : filtered;
        });
      }, 2000);
    });
  }

  private handleUserJoin(user: User): void {
    if (user.id === this.currentUser.id) {
      return;
    }

    this._users.update(users => {
      const exists = users.find(u => u.id === user.id);
      return exists ? users : [...users, user];
    });
  }

  private handleUserLeave(user: User): void {
    this._users.update(users => users.filter(u => u.id !== user.id));
    this._typingUsers.update(typingUsers => typingUsers.filter(u => u !== user.name));
  }
}
