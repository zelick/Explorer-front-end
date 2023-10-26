import { Component, OnInit } from '@angular/core';
import { ClubMemebrshipRequest } from '../model/club-membership-request.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-club-membership-request',
  templateUrl: './club-membership-request.component.html',
  styleUrls: ['./club-membership-request.component.css']
})
export class ClubMembershipRequestComponent implements OnInit{

  requests: ClubMemebrshipRequest[] = [];
  touristName: string;
  clubId: number;

  constructor(private service: AdministrationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const urlClubId = this.route.snapshot.paramMap.get('id') || 0;
    this.clubId = urlClubId ? parseInt(urlClubId, 10) : 0; //parsiraj u number
    this.getRequestsOnProcessing();
  }

  getClubMembershipRequests(): void {
    this.service.getClubMembershipRequests().subscribe({
      next: (result: PagedResults<ClubMemebrshipRequest>) => {
        this.requests = result.results
      },
      error: () => {
      }
    })
  }

  getRequestsOnProcessing(): void {
    this.service.getClubMembershipRequests().subscribe({
      next: (result: PagedResults<ClubMemebrshipRequest>) => {
        this.requests = result.results
        .filter(request => request.status === 'Processing' && request.clubId === this.clubId);
      },
      error: () => {
      }
    })
  }

  rejectRequest(r: ClubMemebrshipRequest): void {
    this.service.rijectRequest(r).subscribe({
      next: () => {
        this.requests = this.requests.filter(request => request.id !== r.id);
      },
    })
  }result: ClubMemebrshipRequest

  acceptRequest(r: ClubMemebrshipRequest): void {
    this.service.acceptRequest(r).subscribe({
      next: (result: ClubMemebrshipRequest) => {
        
        this.service.joinUserToClub(r.touristId, r.clubId).subscribe({
          next: () => {
            this.requests = this.requests.filter(request => request.id !== r.id);
          },
        });

        //this.requests = this.requests.filter(request => request.id !== r.id);
      },
    })
  }
  
  //pronadji turistu koji salje zahtev iz liste svih turista(usera)
  findTouristById(touristId: number): void {
    
  }
}

