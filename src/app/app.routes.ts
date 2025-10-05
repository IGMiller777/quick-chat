import { Routes } from '@angular/router';
import { Chat } from './features/chat/components/chat/chat';

export const routes: Routes = [
  {
    path: '',
    component: Chat,
    title: 'Quick Chat',
  },
  {
    path: 'chat',
    component: Chat,
    title: 'Quick Chat',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
