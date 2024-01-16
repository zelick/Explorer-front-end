import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA,  MatDialogTitle,  MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-secret-dialog',
  templateUrl: './secret-dialog.component.html',
  styleUrls: ['./secret-dialog.component.css']
})
export class SecretDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Checkpoint, private imageService: ImageService) {
    console.log(this.data);
  }

  OnNext(c:Checkpoint):void{
    console.log(this.data);
    let secretPicturesLength= c.checkpointSecret?.pictures!.length||0;
    if(c.currentPicture==(secretPicturesLength-1)){
      c.currentPicture=0;
    }
    else{
      c.currentPicture=c.currentPicture+1;
      c.showedPicture=c.checkpointSecret?.pictures![c.currentPicture]||"";
    }
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}
