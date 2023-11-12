import { TourPurchaseToken } from "./tourPurchaseToken.model";

export interface Customer {
    id?: number;
    touristId: number;
    purchaseTokens: TourPurchaseToken[];
    shoppingCartId: number;
}