import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { MarketplaceService } from "../marketplace.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
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
    saleId: number;
    salesTours: Tour[];

    constructor(
        private service: MarketplaceService,
        private authService: AuthService,
        private router:Router, 
        private route: ActivatedRoute,
        private tourAuthoringService: TourAuthoringService) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.saleForm.reset();
        if (this.shouldEdit) {
            this.saleForm.patchValue(this.sale);
        }
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.saleId = params['id'];

            console.log('saleid::', this.saleId);

            if (this.saleId != -1) {
                this.shouldEdit = true;
                this.service.getSale(this.saleId).subscribe((result: Sale) => {
                    this.sale = result;
                    if (this.sale.id !== undefined && this.sale.toursIds.length != 0) {
                        this.service.getAllToursFromSale(this.sale.id).subscribe(
                            (tours) => {
                                if (this.sale.id !== undefined) {
                                    this.tours = tours;
                                    console.log('ture koje ima: ', this.tours)
                                    this.initializeButtonStatesForUpdate();
                                    for (const tour of this.tours) {
                                        if (tour.id !== undefined) {
                                            this.addedTours.push(tour.id);
                                        }
                                    }
                                }
                                if (this.sale.id !== undefined) {
                                    //ovo je dodato novo
                                    this.tourAuthoringService.getTour().subscribe(
                                        (result) => {
                                            const numberOfToursBefore = this.tours.length;
                                            const newTours = result.filter(newTour => !this.tours.some(existingTour => existingTour.id === newTour.id && existingTour.status === 'Published'));
                                            this.tours = this.tours.concat(newTours);
                                            console.log('nove ture koje treba dodati ako zeli uz stare: ', this.tours)
                                            const numberOfNewTours = this.tours.length - numberOfToursBefore;
                                            if (numberOfNewTours > 0) {
                                            this.initializeButtonStatesForUpdate2(numberOfToursBefore, numberOfNewTours);
                                            }                                    
                                        }, 
                                        (error) => {
                                            console.log('greska pri ucitavanju autorovih tura')
                                        }
                                    )
                                } 

                            },
                            (error) => {
                            console.log(`Greska pri dohvatanju svih tura za ovaj sale`);
                            }
                        );
                        /* if (this.sale.id !== undefined) {
                            this.tourAuthoringService.getTour().subscribe(
                                (result) => {
                                    const numberOfToursBefore = this.tours.length;
                                    this.tours = this.tours.concat(result.filter(tour => tour.status === 'Published'));
                                    const numberOfNewTours = this.tours.length - numberOfToursBefore;
                                    if (numberOfNewTours > 0) {
                                    this.initializeButtonStatesForUpdate2(numberOfToursBefore, numberOfNewTours);
                                    }                                    
                                }, 
                                (error) => {
                                    console.log('greska pri ucitavanju autorovih tura')
                                }
                            )
                        }  */
                    } 
                    if (this.sale.id !== undefined && this.sale.toursIds.length == 0) {
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
                    this.patchFormValues(); 
                });
            }
            else {
                this.shouldEdit = false;

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

        });
      
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
    }

    private patchFormValues(): void {
        this.saleForm.patchValue({
            startDate : this.sale.start,
            endDate : this.sale.end,
            discount : this.sale.discount,
        });
      }

    initializeButtonStates(): void {
        for (let i = 0; i < this.tours.length; i++) {
          this.isAddButtonDisabled[i] = false;
          this.isRemoveButtonDisabled[i] = true;
        }
    }

    initializeButtonStatesForUpdate(): void {
        for (let i = 0; i < this.tours.length; i++) {
            this.isAddButtonDisabled[i] = true;
            this.isRemoveButtonDisabled[i] = false;
          }
    }

    initializeButtonStatesForUpdate2(numberOfToursBefore : number, numberOfNewTours: number): void {
        for (let i = numberOfToursBefore; i < numberOfToursBefore + numberOfNewTours; i++) {
            this.isAddButtonDisabled[i] = false; 
            this.isRemoveButtonDisabled[i] = true
          }
    }

    saleForm = new FormGroup({
        startDate: new FormControl(new Date()),
        endDate: new FormControl(new Date()),
        discount: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^\d+$/)]),
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
            authorId: this.user.id
        }

        this.service.createSale(sale).subscribe(
            (result: Sale) => {
                console.log(result)
                console.log(sale.authorId)
                this.saleUpdated.emit()
                this.router.navigate(['/sales']);
            },
            (error) => {
                alert(error.error);
            }
        )
    }

    openDetails(tour: Tour):void{
        this.router.navigate([`tour-details/${tour.id}`]);
    }

    discardSale(): void {
        this.router.navigate(['/sales']); // Pretpostavka da želite vratiti na sales stranicu
    }

    saleUpdate() {
        const sale: Sale = {
            start: this.saleForm.value.startDate as Date,
            end: this.saleForm.value.endDate as Date,            
            discount: this.saleForm.value.discount || 0,
            toursIds: this.addedTours,
            authorId: this.user.id
        };
        sale.id = this.sale.id;
        this.service.updateSale(sale).subscribe(
            () => {
              this.saleUpdated.emit()
              this.router.navigate(['/sales']);
            },
            (error) => {
                alert(error.error);
            }
        )
    }
}