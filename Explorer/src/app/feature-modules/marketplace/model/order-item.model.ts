export interface OrderItem{
    itemId: number,
    name: string,
    price: number,
    type: ItemType
}

export enum ItemType {
    Tour = 'Tour',
    Bundle = 'Bundle',
}