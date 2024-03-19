import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressTest } from '../model/address-test.model';
import { Checkpoint, CheckpointRequest } from '../model/checkpoint.model';
import { TravelTimeAndMethod } from '../model/travel-time-and-method.model';
import { CheckpointService } from '../checkpoint.service';
import { LatLng } from 'src/app/shared/map/latLng.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourDataService } from '../tourData.service';
import { TransferValue } from '../model/transfer-value.model';
import { EncounterService } from '../../encounters/encounter.service';
import { SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'xp-checkpoint-add',
  templateUrl: './checkpoint-add.component.html',
  styleUrls: ['./checkpoint-add.component.css'],
})
export class CheckpointAddComponent implements OnInit {
  
  @ViewChild(MapComponent) mapComponent: MapComponent;

  addedCheckpoints: Checkpoint[];
  clickedLatLng: LatLng; // export interface LatLng { lat: number,lng: number }
  clickedAddress: string;
  selectedCheckpoint: Checkpoint | null;
  tourId: number ;
  showed: boolean = false;
  distance: number;
  showEncounterForm: boolean = false;
  paramId : any;
  

  constructor(
    private checkpointService: CheckpointService,
    private tourService: TourAuthoringService,
    private route: ActivatedRoute,
    private router: Router,
    private encounterService: EncounterService,
  ) {}

  ngOnInit() {
    this.clickedAddress = '';
    this.route.params.subscribe(params => {
      let tourId = params['id'];
      this.paramId = tourId;
      this.getCheckpoints(this.paramId);
  });

  }

  drawCheckpoints(): void {
    this.mapComponent.drawCheckpoints(this.addedCheckpoints)
    this.mapComponent.setRoute();
  }

  addEncounterOnCheckpoint(checkpoint : Checkpoint) : void {
    this.showEncounterForm = true;
    this.selectedCheckpoint = checkpoint;
  }

  showFullRoute(): void {
    if(this.showed) {
      this.mapComponent.removeRoute();
      this.showed = false;
    }
    else {
      this.mapComponent.setRoute();
      this.showed = true;
    }
  }

  getCheckpoints(id: string): void {
    this.checkpointService.getAllToursCheckpoints(id,0,0).subscribe({
      next: (result: PagedResults<Checkpoint>) => {

        // for(let i=0; i<result.results.length; i++){
        //   this.encounterService.getForCheckpoint(result.results[i].id!).subscribe({
        //     next(enc: any){
        //       result.results[i].encounterId = enc.id;
        //     }
        //   })
        // }
        this.addedCheckpoints = result.results;
        
        this.drawCheckpoints();
        
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }


  checkpointForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    pictureURL: new FormControl(''),
  });

  onPinPlaced(event: AddressTest): void {
    this.clickedAddress = event.address;
    this.clickedLatLng = { lat: event.lat, lng: event.lng };
  }

//--------------------------------------------------------------------------------

  saveCheckpoint(): void {
    const newRequest: CheckpointRequest = {
      comment: "",
      status: 0
    };
    const newCheckpoint: Checkpoint = {
      name: this.checkpointForm.value.name || '',
      description: this.checkpointForm.value.description || '',
      pictureURL: this.checkpointForm.value.pictureURL || '',
      latitude: this.clickedLatLng.lat,
      longitude: this.clickedLatLng.lng,
      tourId: this.paramId,
      PublicRequest: newRequest
    };
    this.checkpointService.addCheckpoint(newCheckpoint).subscribe({
      next: () => {
        
        this.getCheckpoints(this.paramId);
        this.resetForm();
        // this.tourService.getTourById(this.tourId).subscribe({
        //   next: (result) => {
            
        //   }
        // })

        // this.tourDataService.setTourId(this.tourId)
        // this.router.navigate(['/checkpointsdisplay'])
      },
    });
  }

  //--------------------------------------------------------------------------------

  deleteCheckpoint(id: number): void {
    this.checkpointService.deleteCheckpoint(id).subscribe({
      next: () => {
        this.mapComponent.deleteMarkers();
        this.getCheckpoints(this.paramId);
      }
    });
  }

  editCheckpoint(): void {

    const newCheckpoint: any = {
      id: this.selectedCheckpoint?.id,
      name: this.checkpointForm.value.name || '',
      description: this.checkpointForm.value.description || '',
      pictureURL: this.checkpointForm.value.pictureURL || '',
      latitude: this.clickedLatLng.lat,
      longitude: this.clickedLatLng.lng,
      tourId: this.paramId,//this.selectedCheckpoint?.tourId,
      publicRequest: this.selectedCheckpoint?.PublicRequest || '',
    };
    this.checkpointService.editCheckpoint(newCheckpoint).subscribe({
      next: () => {
        this.getCheckpoints(this.paramId);
        this.resetForm();
      },
    });
  }

  resetForm(): void {
    this.checkpointForm.reset();
    this.clickedAddress = '';
    this.clickedLatLng = { lat: 0, lng: 0 };
  }

  editForm(checkpoint: Checkpoint): void {
    this.checkpointForm.get('name')?.setValue(checkpoint.name);
    this.checkpointForm.get('description')?.setValue(checkpoint.description);
    this.checkpointForm.get('pictureURL')?.setValue(checkpoint.pictureURL);
    this.mapComponent
      .reverseSearch(checkpoint.latitude, checkpoint.longitude)
      .subscribe((displayName) => {
        this.clickedAddress = displayName;
      });
    this.selectedCheckpoint = checkpoint;
  }

  changeTourDistanceAndTime(transferObject : TransferValue){
    this.tourService.getSingleTour(this.paramId).subscribe({
      next: (result) =>{
        var tour = result;

        tour.distance = Math.round(transferObject.distance * 100) / 100;

        tour.travelTimeAndMethod = [];
        if(transferObject.travelTime != -1){
          tour.travelTimeAndMethod.push({travelMethod : transferObject.travelMethod ,travelTime : transferObject.travelTime});
        }
        

        this.tourService.updateTour(tour).subscribe();
      }
    })
  }

  goBack(){
    this.router.navigate(['/author/tour-checkpoints/'+this.paramId]);
  }

  // updateTour(){
  //   this.tourService.get
  // }

  drawCheckpoint(latitude: number, longitude: number): void {}
}
