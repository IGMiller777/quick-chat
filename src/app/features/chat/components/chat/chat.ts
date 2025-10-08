import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ChatService } from '@core/services/chat.service';
import { WINDOW } from '@shared/tokens';
import { MessageInputComponent } from '../message-input/message-input';
import { MessageListComponent } from '../message-list/message-list';
import { UserPanelComponent } from '../user-panel/user-panel';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    UserPanelComponent,
    MessageListComponent,
    MessageInputComponent,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy {
  private readonly _chatService = inject(ChatService);
  private readonly _window = inject(WINDOW);

  private _resizeObserver?: ResizeObserver;

  private readonly _isMobileSignal = signal(false);

  public readonly messages = computed(() => this._chatService.messages());
  public readonly users = computed(() => this._chatService.users());
  public readonly typingUsers = computed(() => this._chatService.typingUsers());
  public readonly typingIndicatorText = computed(() => this._chatService.typingIndicatorText());
  public readonly currentUser = computed(() => this._chatService.currentUserInfo());

  public readonly onlineUsers = computed(() =>
    this.users().filter(user => user.id !== this.currentUser().id)
  );

  public readonly onlineUsersCount = computed(() => this.onlineUsers().length + 1);
  public readonly currentUserId = computed(() => this.currentUser().id);
  public readonly isMobile = computed(() => this._isMobileSignal());

  constructor() {
    this.setUpEffects();
  }

  public ngOnInit(): void {
    this.setupResizeObserver();
    this.updateMobileState();
  }

  public ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  public onMessageSent(message: string): void {
    this._chatService.sendMessage(message);
  }

  public onTypingChanged(isTyping: boolean): void {
    this._chatService.setTyping(isTyping);
  }

  public clearMessages(): void {
    this._chatService.clearMessages();
  }

  public refreshChat(): void {
    this._chatService.setTyping(false);
  }

  private setUpEffects(): void {
    effect(() => {
      this.updateMobileState();
    });
  }

  private setupResizeObserver(): void {
    this._resizeObserver = new ResizeObserver(() => {
      this.updateMobileState();
    });

    if (this._window) {
      this._resizeObserver.observe(document.body);
    }
  }

  private updateMobileState(): void {
    if (this._window) {
      const isMobile = this._window.innerWidth <= 768;
      this._isMobileSignal.set(isMobile);
    }
  }
}
