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
        this.requests = result.results;
      },
      error: () => {
      }
    })
  }

  //ovo ne radi - proveriti, delete zahtev 404 error
  rejectRequest(id: number): void {
    this.service.deleteClubMembershipRequest(id).subscribe({
      next: () => {
        this.getClubMembershipRequests();
      },
    })
  }

  //ovo dodati, uvezi da turista koji salje zahtev, toruristId je clan kluba, clubId
  acceptRequest(r: ClubMemebrshipRequest): void {
    
  }
  
  //pronadji turistu koji salje zahtev iz liste svih turista(usera)
  findTouristById(touristId: number): void {
    
  }
}

