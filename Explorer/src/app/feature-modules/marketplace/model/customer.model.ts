import { TourPurchaseToken } from "./tourPurchaseToken.model";

export interface Customer {
    id?: number;
    userId: number;
    tourPurchaseTokens: TourPurchaseToken[];
    shoppingCartId: number;
}