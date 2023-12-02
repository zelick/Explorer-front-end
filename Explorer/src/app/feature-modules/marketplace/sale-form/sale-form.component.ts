import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MarketplaceService } from "../marketplace.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Sale } from "../model/sale.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Tour } from "../../tour-authoring/model/tour.model";
import { TourPreview } from "../model/tour-preview";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";


@Component({
    selector: 'xp-sale-form',
    templateUrl: './sale-form.component.html',
    styleUrls: ['./sale-form.component.css']
  })
  export class SaleFormComponent implements OnInit{

    @Output() saleUpdated = new EventEmitter<null>();
    @Input() sale: Sale;
    @Input() shouldEdit: boolean = false;
    user: User;
    tours: Tour[];
    addedTours: number[] = [];
    sales: Sale[];
    isAddButtonDisabled: boolean[] = [];
    isRemoveButtonDisabled: boolean[] = [];
    
    constructor(
        private service: MarketplaceService,
        private authService: AuthService,
        private router:Router, 
        private tourAuthoringService: TourAuthoringService) { }

  
    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
 
        this.tourAuthoringService.getTour().subscribe(
            (result) => {
                this.tours = result.filter(tour => tour.status === 'Published')
                this.initializeButtonStates();
            }, 
            (error) => {
                console.log('greska pri ucitavanju autorovih tura')
            }
        )
    }

    initializeButtonStates(): void {
        for (let i = 0; i < this.tours.length; i++) {
          this.isAddButtonDisabled[i] = false;
          this.isRemoveButtonDisabled[i] = true;
        }
      }

    saleForm = new FormGroup({
        startDate: new FormControl(new Date()),
        endDate: new FormControl(new Date()),
        discount: new FormControl(0, [Validators.required]),
        selectedTours: new FormControl ([[]])
    });

    addToSale(tourId: number, i: number) {
        if (this.addedTours !== undefined && !this.addedTours.includes(tourId)) {
            this.addedTours.push(tourId);
        }
        this.isAddButtonDisabled[i] = true
        this.isRemoveButtonDisabled[i] = false
    }

    removeFromSale(tourId: number, i: number) {
        if (this.addedTours !== undefined && this.addedTours.includes(tourId)) {
            this.addedTours = this.addedTours.filter((id) => id !== tourId);
        }
        this.isAddButtonDisabled[i] = false
        this.isRemoveButtonDisabled[i] = true
    }

    saleCreation(): void {
        const sale: Sale = {
            start: this.saleForm.value.startDate as Date,
            end: this.saleForm.value.endDate as Date,
            discount: this.saleForm.value.discount || 0,
            toursIds: this.addedTours,
        }

        this.service.createSale(sale).subscribe({
            next: (result: Sale) => {
                console.log(result)
                this.saleUpdated.emit()
                this.router.navigate(['/sales']);
            }
        });
    }

    openDetails(tour: Tour):void{
        this.router.navigate([`tour-details/${tour.id}`]);
    }

      discardSale(): void {
        this.router.navigate(['/sales']); // Pretpostavka da želite vratiti na sales stranicu
    }
}