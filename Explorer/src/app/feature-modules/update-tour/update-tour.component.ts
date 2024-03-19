import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring/tour-authoring.service';
import { Tour } from '../tour-authoring/model/tour.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'xp-update-tour',
  templateUrl: './update-tour.component.html',
  styleUrls: ['./update-tour.component.css']
})
export class UpdateTourComponent {

  allTags: string[] = [
    "adventure", "family", "nature", "urban", "action", "relaxation", "culture", "education",
   "mountain", "hiking", "historical", "eco","winter", "summer", "extreme","solo", "group",
   "photography", "art", "architectural","wildlife", "food", "river", "city"
  ];

  constructor(private route: ActivatedRoute,
              private service: TourAuthoringService,
              private toastr: ToastrService,
              private router : Router
              ) { }

  tourFound : Tour;

  tourForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficult: new FormControl(0),
    tags: new FormControl([])
  });
   
convertDifficultToNumber(difficult: string): number | undefined {
  if (difficult === "Easy") return 0;
  else if (difficult === "Medium") return 1;
  else if (difficult === "Hard") return 2;
  
  return undefined;
}

  paramId : any;

  ngOnInit() :void{
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.paramId = id;

      this.service.getSingleTour(id).subscribe((result) => {
        var alltags = result.tags.split(',');
        var diff = this.convertDifficultToNumber(result.difficult.toString());
        
        this.tourFound = result;

        this.tourForm = new FormGroup({
          name: new FormControl(result.name,[Validators.required]),
          description: new FormControl(result.description, [Validators.required]),
          difficult: new FormControl(diff as number | null),
          tags: new FormControl(alltags as never[] | null)
        });

      });
    });
  }

  updateTour() :void{
    let tour : Tour = {
      id: this.tourFound.id,
      authorId : this.tourFound.authorId,
      name : this.tourForm.value.name || "",
      description : this.tourForm.value.description || "",
      tags : this.tourForm.value.tags?.join(",") || "",
      difficult : Number(this.tourForm.value.difficult) || 0,
      status : this.tourFound.status,
      price : this.tourFound.price,
      distance: this.tourFound.distance,
      travelTimeAndMethod : this.tourFound.travelTimeAndMethod,
      checkpoints : this.tourFound.checkpoints,
      publishTime : this.tourFound.publishTime,
      archiveTime : this.tourFound.archiveTime,
      tourEquipment: this.tourFound.tourEquipment,
    }
    this.service.updateTour(tour).subscribe((result) => {
      this.toastr.success('Tour updated');
      this.router.navigate(['/author/tours']);
    });
  }

  editCheckpoints() :void{
    this.router.navigate(['author/tour-checkpoints/'+this.paramId]);
  }


  
}
