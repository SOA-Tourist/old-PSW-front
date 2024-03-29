import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckpointService } from '../checkpoint.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Checkpoint } from '../model/checkpoint.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourDataService } from '../tourData.service';

@Component({
  selector: 'xp-tour-checkpoints-display',
  templateUrl: './tour-checkpoints-display.component.html',
  styleUrls: ['./tour-checkpoints-display.component.css']
})
export class TourCheckpointsDisplayComponent {

  

  tourCheckpoints : Checkpoint[] = [];
  tourId : any;
  isCheckpointsArrayEmpty : boolean = false;
  isNextButtonEnabled : boolean = false;

  constructor(
    private router: Router,
     private route : ActivatedRoute,
     private checkpointService : CheckpointService,
     private tourDataService : TourDataService,
     ){};

     ngOnInit() {
      this.route.params.subscribe(params => {
          let tourId = params['id'];
          this.tourId = tourId;
          this.getCheckpoints(tourId);
      });
  }

  getCheckpoints(id: string): void {
    this.checkpointService.getAllToursCheckpoints(id,0,0).subscribe({
      next: (result: PagedResults<Checkpoint>) => {
        this.tourCheckpoints = result.results;

        if(this.tourCheckpoints.length === 0){
          this.isCheckpointsArrayEmpty = true
        }
        else{
          this.isCheckpointsArrayEmpty = false
          if(this.tourCheckpoints.length >= 2){
            this.isNextButtonEnabled = true;
          }
          else{
            this.isNextButtonEnabled = false;
          }
        }


      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  removeCheckpoint(checkpoint : Checkpoint){
    this.checkpointService.deleteCheckpoint(checkpoint.id!).subscribe({
      next: () => {
        this.getCheckpoints(this.tourId)
      }
    });
  }

  

  addCheckpoint(){
    this.router.navigate(['/add-checkpoint/'+this.tourId]) 
  }

  goToNextPage(){
    this.router.navigate(['/author/publish-tour/'+this.tourId]) // PROVERITI, DELUJE SVE OK
  }

  saveForLater(){
    this.router.navigate(['/author/tours']) 
  }

}
