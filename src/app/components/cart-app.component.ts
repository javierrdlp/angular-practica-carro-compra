import { Component, OnInit } from '@angular/core';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';
import { ItemsState } from '../store/items.reducer';
import { Store } from '@ngrx/store';
import { add, remove, total } from '../store/items.actions';

@Component({
  selector: 'cart-app',
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {

  items: CartItem[] = [];  

  constructor(
    private store : Store<{items: ItemsState}>,
    private router: Router,
    private sharingDataService: SharingDataService) {
      this.store.select('items').subscribe(state =>{
        this.items = state.items;        
        this.saveSession();        
      })
     }

  ngOnInit(): void {   
    this.onDeleteCart(); // ponemos esto aquí para suscribirse al idProductEventEmitter 
    this.onAddCart(); // ponemos esto aquí para suscribirse al productEventEmitter
    this.store.dispatch(total());
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {

      this.store.dispatch(add({ product }));
      this.store.dispatch(total());          
      
      Swal.fire({
        position: "top",
        icon: "success",
        title: product.name + " añadido al carro",
        showConfirmButton: false,
        timer: 1500,
        width: "20%"
      });      
    });
  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
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
          
          this.store.dispatch(remove({id}));
          this.store.dispatch(total()); 

          this.router.navigate(['/cart']);
         
          Swal.fire({
            title: "¡Eliminado!",
            text: "Tu producto se ha eliminaod del carro.",
            icon: "success"
          });
        }
      });
    })
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }
}
