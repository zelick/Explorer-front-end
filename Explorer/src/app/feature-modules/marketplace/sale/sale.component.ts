import { Component, OnInit } from "@angular/core";
import { MarketplaceService } from "../marketplace.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { User } from "src/app/infrastructure/auth/model/user.model";


@Component({
    selector: 'xp-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.css']
  })
  export class SaleComponent implements OnInit{
    
    user: User;
    isAuthor: boolean = false
    
    constructor(private service: MarketplaceService,private authService: AuthService,private router:Router) { }
  
    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (this.user.role === 'author') {
                console.log(this.user.role)
                this.isAuthor = true
            }
        })
    }

    createSale() {
        this.router.navigate(['/sales-form']);
    }

}