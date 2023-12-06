import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Tour } from "../../tour-authoring/model/tour.model";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";
import { MarketplaceService } from "../marketplace.service";
import { Sale } from "../model/sale.model";

@Component({
    selector: 'xp-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

    user: User;
    isAuthor: boolean = false;
    saleToursMap: { [saleId: number]: Tour[] } = {};
    sales: Sale[];
    sortOrder: 'asc' | 'desc' = 'asc';

    constructor(
        private service: MarketplaceService,
        private authService: AuthService,
        private router: Router,
        private tourAuthoringService: TourAuthoringService) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (this.user.role === 'author') {
                console.log(this.user.role)
                this.isAuthor = true;
            }
            this.getAllSales();
            this.sortSales();
        });
    }

    getAllSales() {
        this.service.getAllSales().subscribe(
            (result) => {
                this.sales = result.results;
                for (const sale of this.sales) {
                    if (sale.id !== undefined && sale.toursIds.length != 0) {
                        this.service.getAllToursFromSale(sale.id).subscribe(
                            (tours) => {
                                if (sale.id !== undefined) {
                                    this.saleToursMap[sale.id] = tours;
                                }
                            },
                            (error) => {
                                console.log(`Greška pri dohvatanju tura za sale ID: ${sale.id}`);
                            }
                        );
                    }
                }
            },
            () => {
                console.log('Greska pri ucitavanju svih sales')
            }
        )
    }

    calculateDiscountedPrice(originalPrice: number, discount: number): number {
        const discountedPrice = originalPrice - (originalPrice * discount / 100);
        return discountedPrice;
    }

    createSale() {
        this.router.navigate([`/sales-form/${-1}`]);
    }

    openDetails(tour: Tour): void {
        this.router.navigate([`tour-details/${tour.id}`]);
    }

    isCurrentUserAuthor(sale: Sale) {
        return sale.authorId === this.user.id
    }

    editSale(sale: Sale) {
        this.router.navigate(['/sales-form/', sale.id]);
    }

    deleteSale(saleId: number) {
        this.service.deleteSale(saleId).subscribe(
            (result) => {
                console.log('Uspesno brisanje sale-a');
                this.getAllSales()
            },
            (error) => {
                console.log('Greska prilikom brisanja sale-a');
            }
        )
    }

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.sortSales();
    }

    sortSales() {
        this.sales.sort((a, b) => {
            const discountA = a.discount;
            const discountB = b.discount;

            if (this.sortOrder === 'asc') {
                return discountA - discountB;
            } else {
                return discountB - discountA;
            }
        });
    }
}