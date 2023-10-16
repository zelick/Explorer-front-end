import { Component, OnInit } from '@angular/core';
import { ClubMemebrshipRequest } from '../model/club-membership-request.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-club-membership-request',
  templateUrl: './club-membership-request.component.html',
  styleUrls: ['./club-membership-request.component.css']
})
export class ClubMembershipRequestComponent implements OnInit{

  requests: ClubMemebrshipRequest[] = [];
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
      this.getClubMembershipRequests();
  }

  getClubMembershipRequests(): void {
    this.service.getClubMembershipRequests().subscribe({
      next: (result: PagedResults<ClubMemebrshipRequest>) => {
        this.requests = result.results;
      },
      error: () => {
      }
    })
  }

}
