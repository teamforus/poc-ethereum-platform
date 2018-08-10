import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations'
import { Toast } from '@models/toast';

@Component({
  selector: 'toast',
  animations: [
    trigger(
      'show', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms', style({ opacity: 1 }))
        ]),
        transition('* => void', [
          style({ opacity: 1 }),
          animate('2000ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  @Input() toast:Toast;


}