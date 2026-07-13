import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() modalTitle = "";
  @Input() modalButton = "";

  @Output() close = new EventEmitter<void>();

  //Emits service to be run
  @Output() buttonAction = new EventEmitter<void>();
}
