import { Component, input } from '@angular/core';
import { IMessage } from '../../../shared/models/IMessage';
import { IUser } from '../../../shared/models/IUser';
import { IConversation } from '../../../shared/models/IConversation';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-chats-list',
  imports: [],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css',
})
export class ChatsListComponent {
  conversations =
    input.required<
      Map<string, [conversation: IConversation, messages: IMessage[]]>
    >();
  currentUserId = input.required<string>();
  providerUser = input.required<IUser>();
  protected readonly user = user;
}
