import { OrderItem } from "./order-item.model"
export interface ShoppingCart{
    id?: number,
    touristId: number,
    price: number,
    items: OrderItem[]
}