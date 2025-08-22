import { Component, inject, input, signal } from '@angular/core';
import { MessagingService } from '../../../shared/services/messaging.service';
import { AsyncPipe } from '@angular/common';
import { IMessage } from '../../../shared/models/IMessage';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../../shared/models/IUser';
import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-chat-dialog',
  imports: [AsyncPipe, InputText, Button, FormsModule],
  templateUrl: './chat-dialog.component.html',
  styleUrl: './chat-dialog.component.css',
})
export class ChatDialogComponent {
  private readonly messagingService = inject(MessagingService);
  private readonly usersService = inject(UsersService);

  serviceId = input.required<string>();
  conversationId = input.required<string>();
  currentUserId = input.required<string>();
  providerUser = input.required<IUser>();
  messages$!: Observable<IMessage[]>;
  messageValue = signal('');

  async ngOnInit() {
    this.messages$ = this.messagingService.getConversationMessages(
      this.serviceId(),
      this.currentUserId(),
    );
  }
  sendMessage() {
    if (this.messageValue().trim().length === 0) return;

    this.usersService
      .getUserById(this.currentUserId())
      .subscribe(async (user) => {
        if (user !== null) {
          await this.messagingService
            .sendMessage({
              conversationId: this.conversationId(),
              body: this.messageValue(),
              createdAt: new Date(),
              senderUser: user,
              receiverUser: this.providerUser(),
            })
            .then(() => this.messageValue.set(''));
        }
      });
  }

  onEnter() {
    this.sendMessage();
  }
}
