import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';



@Component({
  selector: 'choice-course',
  templateUrl: './choice-course.component.html',
  styleUrls: ['./choice-course.component.scss']
})

export class ChoiceCourseComponent implements OnInit{

    commentForm: FormGroup;

    // @Input() comment ?: WeekComment;
    // @Input() date: Date;
    // @Input() weekNumber: number;
    // @Input() promo: Promotion;


    // @Output() updateOrCreate: EventEmitter<WeekComment> = new EventEmitter<WeekComment>();
    // @Output() remove: EventEmitter<WeekComment> = new EventEmitter<WeekComment>();

    @Output() closeModalEmitter: EventEmitter<void> = new EventEmitter<void>();







    constructor(private formBuilder: FormBuilder) {}


    ngOnInit() {
        // console.log('this.promo', this.promo)
        // console.log("this.comment", this.comment);
        // if (!this.comment){
        //     this.comment = new WeekComment();
        // }

        // this.commentForm = this.formBuilder.group({
        //     content: [this.comment.content, [
        //         // Validators.required,
        //     ]],
        // });
    }
    closeModal(){
        console.log("closeModal")
        this.closeModalEmitter.emit();
    }
     
  

}