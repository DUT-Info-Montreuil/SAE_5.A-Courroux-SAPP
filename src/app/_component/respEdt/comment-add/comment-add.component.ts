import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { WeekCommentService } from 'src/app/_service/weekComment.service';
import { WeekComment } from 'src/app/_model/entity/weekComment.model';
import { Promotion } from 'src/app/_model/entity/promotion.model';


@Component({
  selector: 'comment-add',
  templateUrl: './comment-add.component.html',
  styleUrls: ['./comment-add.component.scss']
})

export class CommentAddComponent implements OnInit{

    commentForm: FormGroup;

    @Input() comment ?: WeekComment;
    @Input() date: Date;
    @Input() weekNumber: number;
    @Input() promo: Promotion;


    @Output() updateOrCreate: EventEmitter<WeekComment> = new EventEmitter<WeekComment>();
    @Output() remove: EventEmitter<WeekComment> = new EventEmitter<WeekComment>();

    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();







    constructor(private formBuilder: FormBuilder,
                private commentService: WeekCommentService,
                private toastr: ToastrService) {}


    ngOnInit() {
        console.log('this.promo', this.promo)
        console.log("this.comment", this.comment);
        if (!this.comment){
            this.comment = new WeekComment();
        }

        this.commentForm = this.formBuilder.group({
            content: [this.comment.content, [
                // Validators.required,
            ]],
        });
    }

      onSubmit(){

        if (this.commentForm.invalid) {
            return;
        }
        const comment_value: WeekComment = this.commentForm.value;
        comment_value.year = this.date.getFullYear().toString();
        comment_value.week_number = this.weekNumber;
        comment_value.id_promo = this.promo.id;

        this.commentService.addComment(comment_value).subscribe({
            next: comment => {
                if (comment_value.content != "")
                    this.updateOrCreate.emit(comment);
                else {
                    this.remove.emit(comment);
                }
                this.closeModalAdd();
                // this.toastr.success('Comm ajouté', 'Succès',{timeOut: 1500});
                // this.courseService.addCourseList(course);
            },
            error: response => {
                console.log(response);
                this.toastr.error(response.error.error , 'Erreur',{timeOut: 2000});
            }
        })

      }
      closeModalAdd() {
        console.log("close modal");
        this.closeModal.emit();
      }

  

}