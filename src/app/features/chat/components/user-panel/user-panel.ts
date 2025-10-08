import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { User } from '@shared/models';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanelComponent {
  public readonly user = input.required<User>();
  public readonly onlineUsers = input.required<User[]>();
  public readonly currentUserId = input.required<string>();
  public readonly isMobile = input<boolean>(false);

  public readonly userInitials = computed(() => {
    const { name } = this.user();
    return this.getUserInitials(name);
  });

  public readonly userStatus = computed(() => {
    const { isTyping } = this.user();

    return isTyping ? 'typing...' : 'online';
  });

  public getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
