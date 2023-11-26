import { OrderItem } from "./order-item.model"
export interface ShoppingCart{
    id?: number,
    userId: number,
    price: number,
    items: OrderItem[]
}