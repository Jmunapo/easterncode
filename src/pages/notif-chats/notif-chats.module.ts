import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifChatsPage } from './notif-chats';

@NgModule({
  declarations: [
    NotifChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifChatsPage),
  ],
})
export class NotifChatsPageModule {}
