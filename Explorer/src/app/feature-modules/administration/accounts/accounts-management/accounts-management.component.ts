import { Component, OnInit } from '@angular/core';
import { Account } from '../../model/account.model';
import { AdministrationService } from '../../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from 'src/app/feature-modules/marketplace/marketplace.service';
import { TouristWallet } from 'src/app/feature-modules/marketplace/model/tourist-wallet.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Observable, map, of } from 'rxjs';

export enum Role {
  Administrator = 0,
  Author = 1,
  Tourist = 2
}

@Component({
  selector: 'xp-accounts-management',
  templateUrl: './accounts-management.component.html',
  styleUrls: ['./accounts-management.component.css']
})
export class AccountsManagementComponent implements OnInit {
  accounts: Account[] = [];
  selectedAccount: Account;
  loggedInUserId: number;
  bindingAccounts: { id: number, userId: number, username: string, role: Role, email: string, isActive: boolean, adventureCoins:number, paymentCoins: number }[] = [];
  allUsers: PagedResults<User>;

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedInUserId = user.id;
      this.getAccounts();
    });
  }

  getAllUsers(): void {
    this.service.getAllUsers().subscribe({
        next: (users: PagedResults<User>) => {
            this.allUsers = users;
            this.fillBindingList();
        }
    });
  }
  
  getAdventureCoins(id: number, role: Role): Observable<number> {
    if (this.isTourist(role)) {
      return this.marketplaceService.getAdventureCoins(id).pipe(
        map((result: TouristWallet) => result.adventureCoins)
      );
    }
    else {
      return of(0);
    }
  }

  pay(account: { id: number, userId: number, username: string, role: Role, email: string, isActive: boolean, adventureCoins: number, paymentCoins: number }): void {
    this.marketplaceService.paymentAdventureCoins(account.userId, account.paymentCoins).subscribe({
      next: (result: TouristWallet) => {
        account.adventureCoins = result.adventureCoins
      }
    });
  }

  getAccounts(): void {
    this.service.getAccounts().subscribe({
      next: (result: PagedResults<Account>) => {
        this.accounts = result.results.filter((account) => account.role != Role.Administrator);
        this.getAllUsers()
      },
      error: () => {
      }
    });
  }

  fillBindingList(): void {
    this.accounts.forEach(acc => {
      this.allUsers.results.forEach(user => {
        if(acc.username === user.username) {
          let account: { id: number, userId: number, username: string, role: Role, email: string, isActive: boolean, adventureCoins: number, paymentCoins: number } = {
            id: acc.id,
            userId: user.id,
            username: acc.username,
            role: acc.role,
            email: acc.email,
            isActive: acc.isActive,
            adventureCoins: 0,        
            paymentCoins: 1
          };

          this.getAdventureCoins(user.id, account.role).subscribe((ac: number) => {
            account.adventureCoins = ac;
          }),         

          this.bindingAccounts.push(account);
        }
      });
    });
  }

  getRoleString(role: Role): string {
    switch (role) {
      case Role.Administrator:
        return 'Administrator';
      case Role.Author:
        return 'Author';
      case Role.Tourist:
        return 'Tourist';
      default:
        return 'Unknown';
    }
  }

  isTourist(role: Role): boolean {
    switch (role) {
      case Role.Administrator:
        return false;
      case Role.Author:
        return false;
      case Role.Tourist:
        return true;
      default:
        return false;
    }
  }

  blockAccount(id: number): void {
    const confirmBlock = window.confirm("Are you sure you want to block this user?");
    
    if (confirmBlock) {
      this.service.block(id).subscribe({
        next: () => {
          this.bindingAccounts.length = 0;
          this.getAccounts();
        },
        error: () => {
        }
      });
    }
  }
}
