import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../administration.service';
import { CheckpointRequest } from '../../model/checkpoint-request.model'
import { Status } from '../../model/checkpoint-request.model';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-checkpoint-request-review',
  templateUrl: './checkpoint-request-review.component.html',
  styleUrls: ['./checkpoint-request-review.component.css']
})
export class CheckpointRequestReviewComponent implements OnInit{
  
  requestDetails: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean }[] = [];
  allCheckpoints: PagedResults<Checkpoint>;
  allUsers: PagedResults<User>;
  allCheckpointRequests: CheckpointRequest[] = [];

  constructor(private adminService: AdministrationService, private tourAuthService: TourAuthoringService) { }


  ngOnInit(): void {
    this.getAllRequests();
  }

  getAllRequests(): void {
    this.adminService.getAllCheckpointRequests().subscribe({
        next: (requests: CheckpointRequest[]) => {
            this.allCheckpointRequests = requests;
        },
        error: () => {
            // Handle errors
        }
    });

    this.getAllCheckpoints();
  }

  getAllCheckpoints(): void {
    this.tourAuthService.getCheckpoints().subscribe({
        next: (checkpoints: PagedResults<Checkpoint>) => {
            this.allCheckpoints = checkpoints;
        },
        error: () => {
            // Handle errors
        }
    });

    this.getAllUsers();
  }

  getAllUsers(): void {
    this.adminService.getAllUsers().subscribe({
        next: (users: PagedResults<User>) => {
            this.allUsers = users;
        },
        error: () => {
            // Handle errors
        }
    });

    this.fillRequestDetails();
  }

  fillRequestDetails(): void {
    this.allCheckpointRequests.forEach(request => {
      this.allCheckpoints.results.forEach(checkPoint => {
        this.allUsers.results.forEach(user => {
          if(request.authorId === user.id && request.checkpointId === checkPoint.id) {
            let req: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean } = {
              id: request.id,
              checkpointName: checkPoint.name,
              checkpointDescription: checkPoint.description,
              authorName: user.username,
              status: request.status,
              onHold: this.investigateStatus(request.status)
            };

            this.requestDetails.push(req);
          }
        });
      });
    });
  }

  investigateStatus(s: Status): boolean {
    if(s === Status.OnHold) return true;
    else return false;
  }

  acceptRequest(req: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean }): void {
    this.adminService.acceptCheckpointRequest(req.id).subscribe({
      next: () => {
        this.getAllRequests();
    },
      error: () => {
        // Handle errors
    }
    })
  }

  rejectRequest(req: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean }): void {
    this.adminService.rejectCheckpointRequest(req.id).subscribe({
      next: () => {
        this.getAllRequests();
    },
      error: () => {
        // Handle errors
    }
    })
  }

}
