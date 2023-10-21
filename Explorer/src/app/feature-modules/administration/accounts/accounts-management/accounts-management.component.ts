import { Component, OnInit } from '@angular/core';
import { Account } from '../../model/account.model';
import { AdministrationService } from '../../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

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

  constructor(
    private service: AdministrationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedInUserId = user.id;
      this.getAccounts();
    });
  }

  getAccounts(): void {
    this.service.getAccounts().subscribe({
      next: (result: PagedResults<Account>) => {
        this.accounts = result.results.filter((account) => account.id !== this.loggedInUserId);
      },
      error: () => {
      }
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

  blockAccount(id: number): void {
    const confirmBlock = window.confirm("Are you sure you want to block this user?");
    
    if (confirmBlock) {
      this.service.block(id).subscribe({
        next: () => {
          this.getAccounts();
        },
        error: () => {
        }
      });
    }
  }
}
