import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { CartItem } from '../../models/cartItem';

@Component({
  selector: 'modal-cart',
  imports: [CartComponent],
  templateUrl: './modal-cart.component.html'
})
export class ModalCartComponent {

  @Input() items: CartItem[] = [];
  @Input() total: number= 0;

  @Output() closeCartEventEmitter = new EventEmitter();
  @Output() idProductEventEmitter = new EventEmitter();

  closeCart(): void{
    this.closeCartEventEmitter.emit();
  }

  onDeleteCart(id: number): void{
    this.idProductEventEmitter.emit(id);
  }

}
