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
  
  requestDetails: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean, comment: string }[] = [];
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
            this.getAllCheckpoints();
        },
        error: () => {
            // Handle errors
        }
    });

    //this.getAllCheckpoints();
  }

  getAllCheckpoints(): void {
    this.tourAuthService.getCheckpoints().subscribe({
        next: (checkpoints: PagedResults<Checkpoint>) => {
            this.allCheckpoints = checkpoints;
            this.getAllUsers();
        },
        error: () => {
            // Handle errors
        }
    });

    //this.getAllUsers();
  }

  getAllUsers(): void {
    this.adminService.getAllUsers().subscribe({
        next: (users: PagedResults<User>) => {
            this.allUsers = users;
            this.fillRequestDetails();
        },
        error: () => {
            // Handle errors
        }
    });

    //this.fillRequestDetails();
  }

  fillRequestDetails(): void {
    this.allCheckpointRequests.forEach(request => {
      this.allCheckpoints.results.forEach(checkPoint => {
        this.allUsers.results.forEach(user => {
          if(request.authorId === user.id && request.checkpointId === checkPoint.id) {
            let req: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean, comment: string } = {
              id: request.id,
              checkpointName: checkPoint.name,
              checkpointDescription: checkPoint.description,
              authorName: user.username,
              status: request.status,
              onHold: this.investigateStatus(request.status),
              comment: ""
            };

            this.requestDetails.push(req);
          }
        });
      });
    });
  }

  investigateStatus(s: Status): boolean {
    return s.toString() === 'OnHold';
  }

  acceptRequest(req: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean, comment: string }): void {
    if(req.comment === "") {
      req.comment = "Your request for checkpoint " + req.checkpointName + " with description: " + req.checkpointDescription + ", is accepted.";
    } else {
      let enteredComment: string = req.comment;
      req.comment = "Administrator's comment: " + enteredComment + "\n\nConclusion: Your request for checkpoint " + req.checkpointName + " with description: " + req.checkpointDescription + ", is accepted.";
    }

    this.adminService.acceptCheckpointRequest(req.id, req.comment).subscribe({
      next: () => {
        this.requestDetails.length = 0;
        this.getAllRequests();
    },
      error: () => {
        // Handle errors
    }
    })
  }

  rejectRequest(req: { id: number, checkpointName: string, checkpointDescription: string, authorName: string, status: Status, onHold:boolean, comment: string }): void {
    if(req.comment === "") {
      req.comment = "Your request for checkpoint " + req.checkpointName + " with description: " + req.checkpointDescription + ", is rejected.";
    } else {
      let enteredComment: string = req.comment;
      req.comment = "Administrator's comment: " + enteredComment + "\n\nConclusion: Your request for checkpoint " + req.checkpointName + " with description: " + req.checkpointDescription + ", is rejected.";
    }

    this.adminService.rejectCheckpointRequest(req.id, req.comment).subscribe({
      next: () => {
        this.requestDetails.length = 0;
        this.getAllRequests();
    },
      error: () => {
        // Handle errors
    }
    })
  }

}
