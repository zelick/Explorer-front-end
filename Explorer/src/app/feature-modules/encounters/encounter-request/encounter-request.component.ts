import { Component } from '@angular/core';
import { EncounterService } from '../encounter.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image/image.service';
import { FormControl, Validators,FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Encounter } from '../model/encounter.model';
import { __values } from 'tslib';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { EncounterRequest } from '../model/encounterRequest.model';
import { Status } from '../model/encounterRequest.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-encounter-request',
  templateUrl: './encounter-request.component.html',
  styleUrls: ['./encounter-request.component.css']
})
export class EncounterRequestComponent {
  requestDetails: { id: number, encounterName: string, encounterXp: number,encounterLongitude: number,encounterLatitude: number, touristName: string, status: Status, onHold:boolean}[] = [];
  allEncounters: PagedResults<Encounter>;
  allUsers: PagedResults<User>;
  allEncounterRequests: PagedResults<EncounterRequest>;

  constructor(private encounterService: EncounterService) { }

  ngOnInit(): void {
    this.getAllRequests();
  }

  getAllRequests(): void {
    this.encounterService.getAllRequests().subscribe({
        next: (requests: PagedResults<EncounterRequest>) => {
            this.allEncounterRequests = requests;
            this.getAllObjects();
        },
        error: () => {
            // Handle errors
        }
    });

    //this.getAllCheckpoints();
  }

  getAllObjects(): void {
    this.encounterService.getEncounters().subscribe({
        next: (objects: PagedResults<Encounter>) => {
            this.allEncounters = objects;
            this.getAllUsers();
        },
        error: () => {
            // Handle errors
        }
    });

    //this.getAllUsers();
  }

  getAllUsers(): void {
    this.encounterService.getAllUsers().subscribe({
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
    this.allEncounterRequests.results.forEach(request => {
      this.allEncounters.results.forEach(encounter => {
        this.allUsers.results.forEach(user => {
          if(request.touristId === user.id && request.encounterId === encounter.id) {
            let req: { id: number, encounterName: string, encounterXp: number,encounterLongitude: number,encounterLatitude: number, touristName: string, status: Status, onHold:boolean} = {
              id: request.id,
              encounterName: encounter.name,
              encounterXp: encounter.xp,
              encounterLatitude: encounter.latitude,
              encounterLongitude: encounter.longitude,
              touristName: user.username,
              status: request.status,
              onHold: this.investigateStatus(request.status),
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

  acceptRequest(req: { id: number, encounterName: string, encounterXp: number,encounterLongitude: number,encounterLatitude: number, touristName: string, status: Status, onHold:boolean }): void {
    this.encounterService.acceptRequest(req.id).subscribe({
      next: () => {
        this.requestDetails.length = 0;
        this.getAllRequests();
    },
      error: () => {
        // Handle errors
    }
    })
  }

  rejectRequest(req: { id: number, encounterName: string, encounterXp: number,encounterLongitude: number,encounterLatitude: number, touristName: string, status: Status, onHold:boolean }): void {
    this.encounterService.rejecttRequest(req.id).subscribe({
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
