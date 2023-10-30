import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router'; 
import { ClubMemebrshipRequest } from '../model/club-membership-request.model';


@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnChanges, OnInit{

  club: Club[] = [];
  selectedClub: Club;
  shouldEdit: boolean;
  shouldAdd: boolean = false;
  currentUserTouristId: number = 0; //
  requestSent: boolean = false;
  requests: ClubMemebrshipRequest[] = [];
  userClubs: Club[] = [];
  

  constructor(private authService: AuthService, private service: AdministrationService, private router: Router) 
  {
    this.getClub();

    this.authService.user$.subscribe(user => {
      this.currentUserTouristId = user?.id || 0;
    });
    //dodala
    this.getUserClubs();
    this.getRequests();
  }
  ngOnInit(): void {
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.getClub();

    this.authService.user$.subscribe(user => {
      this.currentUserTouristId = user?.id || 0;
    });

    //dodala
    this.getRequests();
  }

  getRequests(): void {
    this.service.getClubMembershipRequests().subscribe({
      next: (result: PagedResults<ClubMemebrshipRequest>) => {
          this.requests = result.results;
      },
    })
  }


  getClub(): void {
    this.service.getClub().subscribe({
      next: (result: PagedResults<Club>) => {
        this.club = result.results;
      },
      error: () => {
      }
    })  
  }

  
  getUserClubs(): void {
    this.service.getUserClubs(this.currentUserTouristId).subscribe({
      next: (result: Club[]) => {
        console.log(result);
        this.userClubs = result;
      },
      error: () => {
      }
    })  
  }

    onEditClicked(club: Club): void {
      this.selectedClub = club;
      this.shouldEdit = true;
    }

    onAddClicked(): void {
        this.shouldAdd = true;
        this.shouldEdit = false;
    }

    onCloseClicked(): void {
      this.shouldAdd = false;
      this.shouldEdit = false;
    }

    isCurrentUserOwner(club: Club): boolean {
      return this.currentUserTouristId === club.touristId;
    }

    deleteClub(id: number): void {
      this.service.deleteClub(id).subscribe({
        next: () => {
          this.getClub();
        },
      })
    }


    navigateToClubMembershipRequests(clubId : number): void {
      this.router.navigate(['/clubMembershipRequests', clubId]);
    }

    userBelongsToClub(club: Club): boolean {
      console.log(this.userClubs);
      return this.userClubs.find(c => c.id === club.id) != null;
    }

    sendClubMembershiprequest(clubId: number): void {
     
      const newClubRequest: ClubMemebrshipRequest = {
        clubId: clubId,
        touristId: this.currentUserTouristId, 
        status: "Processing"
      } 

      this.service.createRequest(newClubRequest).subscribe({
        next: () => { 
          location.reload();
        }
      });
    }

    isRequestSent(clubId: number): boolean {
      return this.requests.find(request => request.clubId === clubId && request.touristId === this.currentUserTouristId && request.status == "Processing") != null;
    }


   findRequst(clubId: number, userId: number): number {
      this.getRequests();
      const request = this.requests.find(request => request.clubId == clubId && request.touristId == userId);
      if (request) {
        return request.id || 0;
      }
      return 0;
    }

    deleteRequest(club: Club): void {
      const requestId = this.findRequst(club.id!, this.currentUserTouristId);

      this.service.deleteRequest(requestId).subscribe({
        next: () => {
           location.reload();
        },
      })
    }
    navigateToManageMembers(clubId : number): void{
      this.router.navigate(['/club-members', clubId]);
    }
}
