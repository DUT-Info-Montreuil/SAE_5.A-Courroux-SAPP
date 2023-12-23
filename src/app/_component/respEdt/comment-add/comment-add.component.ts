import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { WeekCommentService } from 'src/app/_service/weekComment.service';
import { WeekComment } from 'src/app/_model/entity/weekComment.model';


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

    @Output() updateOrCreate: EventEmitter<WeekComment> = new EventEmitter<WeekComment>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();







    constructor(private formBuilder: FormBuilder,
                private commentService: WeekCommentService,
                private toastr: ToastrService) {}


    ngOnInit() {
        console.log("this.comment", this.comment);
        if (!this.comment){
            this.comment = new WeekComment();
        }

        this.commentForm = this.formBuilder.group({
            content: [this.comment.content, [
                Validators.required,
            ]],
        });
    }

      onSubmit(){

        if (this.commentForm.invalid) {
            return;
        }
        const comment: WeekComment = this.commentForm.value;
        comment.year = this.date.getFullYear().toString();
        comment.week_number = this.weekNumber;

        this.commentService.addComment(comment).subscribe({
            next: comment => {
                this.updateOrCreate.emit(comment);
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