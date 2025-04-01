import { Component, OnInit } from '@angular/core';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'cart-app',
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {  

  items: CartItem[] = [];

  total: number = 0;

  constructor(
    private router: Router,
    private sharingDataService: SharingDataService) { }

  ngOnInit(): void {   
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.calculateTotal();
    this.onDeleteCart(); // ponemos esto aquí para suscribirse al idProductEventEmitter 
    this.onAddCart(); // ponemos esto aquí para suscribirse al productEventEmitter
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {

      const hasItem = this.items.find(item => item.product.id === product.id);
      if (hasItem) {
        this.items = this.items.map(item => {
          if (item.product.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
         
          return item;          
        })       
      } else {
        this.items = [... this.items, { product: { ...product }, quantity: 1 }];
      }
      Swal.fire({
        position: "top",
        icon: "success",
        title: product.name + " añadido al carro",
        showConfirmButton: false,
        timer: 1500,
        width: "20%"
      });
      sessionStorage.setItem('cart', JSON.stringify(this.items));
      this.saveSession();
      this.calculateTotal();      
    });
  }

  onDeleteCart(): void {    
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      this.items = this.items.filter(item => item.product.id !== id);
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No hay vuelta atrás",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.items.length === 0) {
            sessionStorage.removeItem('cart');
          }
          this.saveSession();
          this.calculateTotal();
    
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/cart'], {
              state: {items: this.items, total: this.total}
            })
          })           
          Swal.fire({
            title: "¡Eliminado!",
            text: "Tu producto se ha eliminaod del carro.",
            icon: "success"
          });
        }
      });
        
    })
  }

  calculateTotal(): void {
    this.total = this.items.reduce((total, item) => total + (item.quantity * item.product.price), 0);
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }
}
