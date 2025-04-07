import { createReducer, on } from "@ngrx/store";
import { load, findAll } from "./products.actions";


const products: any[] =[];

const initialState = {
    //products: products
    products
}

export const productsReducer = createReducer(
    initialState,
    on(load, (state) => ({ products: [...state.products]})),
    on(findAll, (state,{ products }) => ({ products: [...products]}))
   /* on(load, (state, payload) => {
        return{
            products: [... payload.products]
        }
    }),
    */
)