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
  touristName: string;
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
      this.getClubMembershipRequests();
  }

  getClubMembershipRequests(): void {
    this.service.getClubMembershipRequests().subscribe({
      next: (result: PagedResults<ClubMemebrshipRequest>) => {

        const requestsOnProcessing: ClubMemebrshipRequest[] = [];

        for (let i = 0; i < result.results.length; i++) {
          if (result.results[i].status === 'Processing') {
            requestsOnProcessing.push(result.results[i]);
          }
        }
        this.requests = requestsOnProcessing;
      },
      error: () => {
      }
    })
  }

  rejectRequest(r: ClubMemebrshipRequest): void {
    this.service.rijectRequest(r).subscribe({
      next: () => {
        this.getClubMembershipRequests();
      },
    })
  }

  acceptRequest(r: ClubMemebrshipRequest): void {
    this.service.acceptRequest(r).subscribe({
      next: () => {
        this.getClubMembershipRequests(); //azuriraj tabelu
      },
    })
  }
  
  //pronadji turistu koji salje zahtev iz liste svih turista(usera)
  findTouristById(touristId: number): void {
    
  }
}

