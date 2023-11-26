import { Component,OnInit,OnChanges } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckpointSecret } from '../model/checkpointSecret.model';


@Component({
  selector: 'xp-checkpoint-secret-form',
  templateUrl: './checkpoint-secret-form.component.html',
  styleUrls: ['./checkpoint-secret-form.component.css']
})
export class CheckpointSecretFormComponent implements OnInit{

  constructor(private service: TourAuthoringService,private router:Router,private activatedRoute:ActivatedRoute){
  }

  id:number;
  shouldEdit:Boolean=false;
  checkpoint:Checkpoint;
  picture: string = '';
  pictures: string[] = [];

  secretForm = new FormGroup({
    description: new FormControl(''),
  });
  pictureForm  = new FormGroup({
    picture: new FormControl(''),
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.id=params['id'];
      if(this.id>0)
      {
        this.getCheckpoint(this.id);
      }
    })

  }

  ngOnChanges(): void {
    console.log("TT");
    console.log(this.checkpoint);
    if(this.checkpoint.checkpointSecret!=null){
      this.pictures=this.checkpoint.checkpointSecret?.pictures||[];
      this.secretForm.patchValue(this.checkpoint);
    }
  }

  getCheckpoint(id: number): void {
    this.service.getCheckpoint(id).subscribe((result: Checkpoint) => {
      this.checkpoint = result;
      console.log(this.checkpoint);
      if(this.checkpoint.checkpointSecret!=null){
        this.pictures=this.checkpoint.checkpointSecret?.pictures||[];
        this.secretForm.patchValue(this.checkpoint.checkpointSecret);
      }
    });
  }
  addPicture(): void{
    this.picture = this.pictureForm.value.picture || '';
    if(this.picture != '')
      this.pictures.push(this.picture);
    this.pictureForm.reset();
  }

  deletePicture(i: number): void{
    this.pictures.splice(i, 1);
  }

  onFinish():void{
    const secret: CheckpointSecret = {
      description: this.secretForm.value.description||"",
      pictures: this.pictures || "",
    };

    if(secret.description!=="")
    {
      console.log(secret);
      this.service.addCheckpointSecret(secret,this.id).subscribe((result: Checkpoint) => {
        this.checkpoint = result;
        console.log(this.checkpoint);
      });
      this.router.navigate([`checkpoint/${this.checkpoint.tourId}`]);
    }

  }

}
