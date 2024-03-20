import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourDataService } from '../tourData.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { CheckpointService } from '../checkpoint.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'xp-publish-tour',
  templateUrl: './publish-tour.component.html',
  styleUrls: ['./publish-tour.component.css']
})
export class PublishTourComponent {

  paramId: any;
  tour: Tour;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourDataService : TourDataService,
    private service : TourAuthoringService,
    private checkpointService: CheckpointService,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void{

    this.route.params.subscribe(params => {
      let tourId = params['id'];
      this.paramId = tourId;
      this.service.getSingleTour(this.paramId).subscribe({
        next: (result) =>{
          this.tour = result;
          this.checkpointService.getAllToursCheckpoints(this.paramId,0,0).subscribe({
            next : (checkpoints) =>{
              this.tour.checkpoints = checkpoints.results;
            }
          })
        }
  });
})
     

  }

publish(){
  console.log(this.tour);
    var isOk = true;
    if(!this.tour.name){
      isOk = false;
    }
    if(!this.tour.description){
      isOk = false;
    }
    if(this.tour.checkpoints.length < 2){
      isOk = false;
    }
    if(!this.tour.tags){
      isOk = false;
    }


    if(isOk){
      this.service.publishTour(this.paramId).subscribe({
        next : () =>{
          this.toastr.success("Tour published successfully");
          this.router.navigate(['/author/tours'])
        }
      })
    }
    else{
      this.toastr.error("Error. The tour was not created correctly, please try again ");
    }

  }

  saveForLater(){
    this.router.navigate(['/author/tours']) 
  }
}
