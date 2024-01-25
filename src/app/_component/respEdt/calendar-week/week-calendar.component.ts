import { HostListener, Component, OnInit, Input } from '@angular/core';
import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Subject, forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TeacherService } from '../../../_service/teacher.service';
import { Teacher } from '../../../_model/entity/teacher.model';
import { CourseService } from '../../../_service/course.service';
import { Course } from '../../../_model/entity/course.model';
import { ResourceService } from '../../../_service/resource.service';
import { Resource } from '../../../_model/entity/resource.model';
import { Group } from '../../../_model/entity/group.model';
import { GroupService } from '../../../_service/group.service';
import { addDays, format, getWeek, startOfWeek } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { RoomService } from 'src/app/_service/room.service';
import { WeekCommentService } from 'src/app/_service/weekComment.service';
import { WeekComment } from 'src/app/_model/entity/weekComment.model';
import { Promotion } from 'src/app/_model/entity/promotion.model';
import { EdtManagerService } from 'src/app/_service/edtManager.service';
import { ViewEncapsulation} from '@angular/core';
import { UserService } from 'src/app/_service/user.service';
import { User } from 'src/app/_model/entity/user.model';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@Component({
  selector: 'app-calendar-week-view-resp-edt',
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class WeekCalendarComponent implements OnInit {
  
  @Input() user: User;
  courses: Course[] = [];
  teachers: Teacher[] = [];
  salles: any[] = [];
  ressources: Resource[] = [];
  groupes: Group[] = [];
  comments: WeekComment[] = [];

  ressourcesShow: Resource[] = [];
  group_show: Group[] = [];

  promoManaged: Promotion[] = [];
  promoSelected: Promotion = new Promotion();

  loading = true;

  showModalComment = false;

  courseForEdit: Course | null;
  coursesToPaste: Course[] = [];

  isWeekCalendar = true;
  viewPhone = false;

  selectedDays: {name: string, selected: boolean, date: Date}[] = [];

  idUser: any;
  
  pasteEnable: boolean = false;

  public eventSelectionne: any = null;

  isDrawerOpen = false;

  showModalMod = false;
  showModalAdd = false;
  showModalCopy = false;
  showModalPaste = false;
  showModalStats = false;
  showModalChoice = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];
  eventsToPushToBd: CalendarEvent[] = [];

  refresh = new Subject<void>();

  getIndex(event: any){
    return this.events.indexOf(event.event);
  }

  constructor(
    private datePipe: DatePipe,
    private teacherService: TeacherService,
    private courseService: CourseService,
    private resourceService: ResourceService,
    private groupService: GroupService,
    private toastr: ToastrService,
    private roomService: RoomService,
    private weekCommentService: WeekCommentService,
    private edtManagerService: EdtManagerService,
    private userService: UserService,) {
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateView();
  }

  private updateView(): void {
    const largeurEcran = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.isWeekCalendar = largeurEcran > 768;
    this.viewPhone = largeurEcran > 1361;
  }

  ngOnInit(): void {
    // this.setViewDate();
    this.updateView();
    forkJoin([
      this.teacherService.getTeachers(), 
      this.roomService.getSalles(), 
      this.resourceService.getResources(), 
      this.groupService.getGroups(),
      this.weekCommentService.getComments(),
      this.edtManagerService.getPromoEdtManager()
    ]).subscribe({
      next: data  => {
        this.teachers = data[0].filter(teacher => teacher.activated);
        this.salles = data[1]
        this.ressources = data[2]
        this.groupes = data[3]
        this.comments = data[4]
        this.promoManaged = data[5]
        if (this.promoManaged.length > 0){
          this.promoSelected = this.promoManaged[0];
        }
        this.loadEvents();
        this.loading = false;
      },
      error :error => {
        console.log(error);
      }
    });
    this.userService.getIdentify().subscribe({
      next: user => {
        this.idUser = user.id;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  setViewDate(){
    let day = this.viewDate.getDay();
    let diff = this.viewDate.getDate() - day + (day == 0 ? -6:1);

    if (this.viewDate.getDay() == 0){this.viewDate.setDate(this.viewDate.setDate(1));}
  }

  getWeek(date: Date) {
    const dayOfWeek = date.getDay(); // Obtient le jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
    const diff = date.getDate() - dayOfWeek; // Calcul de la différence pour obtenir le dimanche de la semaine
    const sunday = new Date(date); // Crée une nouvelle instance de Date basée sur la date d'origine
    sunday.setDate(diff);
    return getWeek(sunday, { weekStartsOn: 0 });
  }

  changePromotion(event: any){
    let id_promo = event.target.value;
    this.promoSelected = this.promoManaged.find(promo => promo.id == id_promo)!;
    this.loadEvents();
  }

  addOrUpdateComment(comment: WeekComment){
    let index = this.comments.findIndex(comment_find => comment_find.id == comment.id);
    if (index == -1){
      this.comments.push(comment);
    }else{
      this.comments[index] = comment;
    }
  }
  deleteComment(comment: WeekComment){
    this.comments = this.comments.filter(comment_find => comment_find.id != comment.id);
  }
  
 

  openModalAdd() {
    this.showModalAdd = true;
  }
  
  closeModalAdd() {
    this.showModalAdd = false;
  }

  openModalStats() {
    this.showModalStats = true;
  }

  closeModalStats() {
    this.showModalStats = false;
  }


  

  getComment(date : Date){
    let week_number = this.getWeek(date);
    let year = date.getFullYear().toString();
    return this.comments.find(comment => comment.week_number == week_number && comment.year == year && comment.id_promo == this.promoSelected.id);
  }

  toggleModalComment(){
    this.showModalComment = !this.showModalComment;
  }


  openModalCopy() {
    this.showModalCopy = true;
  }

  closeModalCopy() {
    this.showModalCopy = false;
  }

  openModalPaste() {
    this.showModalPaste = true;
  }

  closeModalPaste() {
    this.showModalPaste = false;
    this.refresh.next();
  }

  loadEvents(){
    this.showModalComment = false;
    this.events = [];

    let day = this.viewDate.getDay();
    // let diff = this.viewDate.getDate() - day + (day == 0 ? -6:1);
    let diff = this.viewDate.getDate() - day + 1;
    let date_temp = new Date(this.viewDate);
    let monday = new Date(date_temp.setDate(diff));
    let friday = new Date(date_temp.setDate(diff + 4));

    const args = [{date_min: format(monday, 'yyyy-MM-dd')}, {date_max: format(friday, 'yyyy-MM-dd')}, {group: this.promoSelected.group.id}];

    this.courseService.getCourses(args).subscribe({
      next : courses => {
        this.courses = courses;
        this.events = [];
        for (let course of courses) {
          this.addEvent(course);
        }
        this.refresh.next();
        this.ressourcesShow = this.ressources.filter(ressource => ressource.id_promo == this.promoSelected.id);
        this.getGroupTree();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  redirectToUtilitaires(){
    window.location.href = "/ajout";
  }

  redirectToGestionGroupes(){
    window.location.href = "/groupes";
  }

  addCourse(course: Course) {
    this.courses.push(course);
    this.addEvent(course);
    this.refresh.next();
  }

  addEvent(course: Course): void {
    this.events.push({
      id: course.id,
      title: course.initial_ressource,
      start: new Date(course.start_time),
      end: new Date(course.end_time),
      color: {
        primary: "#FFFFFF",
        secondary: this.getRessourcesByInitial(course.initial_ressource)!.color,
      },        
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      cssClass: `calendar-position-${this.getPosition(course)} calendar-width-${this.getWidth(course)}`
    });
  }

  getWidth(course: Course): number {
    let group = this.groupes.find(group => group.id == course.id_group);
    let width = 100;
    while (group && group.id_group_parent != null){
      const groupsInParent = this.groupes.filter(group_curr => group_curr.id_group_parent == group!.id_group_parent);
      width = width / groupsInParent.length;
      group = this.groupes.find(group_curr => group_curr.id == group!.id_group_parent);
    }
    return Math.ceil(width)
  }

  getPosition(course: Course): number {
    let group = this.groupes.find(group => group.id == course.id_group);
    let pourcents: any[] = [];
    while (group && group.id_group_parent != null){
      const groupsInParent = this.groupes.filter(group_curr => group_curr.id_group_parent == group!.id_group_parent);
      const index = groupsInParent.indexOf(group!);
      pourcents.push({index: index, length: groupsInParent.length});
      group = this.groupes.find(group_curr => group_curr.id == group!.id_group_parent);
    }
    let left = 0;
    if (pourcents.length > 0){
      const last = pourcents.pop();
      let parentPourcent = 100 / last.length;
      left = last.index * parentPourcent;
      
      for (let item of pourcents.reverse()){
        parentPourcent = parentPourcent / item.length;
        left = left + item.index * parentPourcent;
      }
    }
    return Math.ceil(left);
  }

  removeCourse(course_remove: Course): void {
    this.courses = this.courses.filter((course) => course.id !== course_remove.id);
    this.events = this.events.filter((event) => event.id !== course_remove.id);
  }

  toggleWeekCalendar(){
    this.isWeekCalendar = !this.isWeekCalendar;
  }

  changeViewDay(event : any){
    this.viewDate = new Date(event.day.date);
    this.toggleWeekCalendar()
  }

  getGroupTree(){
    this.group_show = [];
    const group_ids: number[] = [];
    group_ids.push(this.promoSelected.group.id);
    while (group_ids.length > 0){
      const group_id = group_ids.pop();
      const group_find = this.groupes.find(group => group.id == group_id);
      if (group_find){
        this.group_show.push(group_find);
        const groups_temps = this.groupes.filter(group => group.id_group_parent == group_find.id);
        if (groups_temps.length > 0){
          for (let group of groups_temps){
            group_ids.push(group.id);
          }
        }
      }
    }
  }

  eventClicked(event: any) {
    this.eventSelectionne = event;
    Promise.all([this.loadEventStart(this.eventSelectionne), this.loadEventEnd(this.eventSelectionne)])
      .then(([loadedEventStart, loadedEventEnd]) => {
        this.updateDateStart(loadedEventStart);
        this.updateDateEnd(loadedEventEnd);
        this.courseForEdit = this.getCourseByEventId(this.eventSelectionne.event.id)!;
        this.showModalChoice = true;
      }
    );
  }
  
  loadEventStart(event: any): Promise<Date> {
    return new Promise<Date>((resolve, reject) => {
      setTimeout(() => {
        const loadedEventStart = event.event.start;
        resolve(loadedEventStart);
      }, 100);
    });
  }
  
  loadEventEnd(event: any): Promise<Date> {
    return new Promise<Date>((resolve, reject) => {
      setTimeout(() => {
        const loadedEventEnd = event.event.end;
        resolve(loadedEventEnd);
      }, 100);
    });
  }

  eventTimesChanged(event: any) {
    let course_find = this.courses.find(course => course.id == event.event.id);
    if (!course_find){
      return;
    }

    let start_time_initial = course_find.start_time;
    let end_time_initial = course_find.end_time;
    
    course_find.start_time = event.newStart;
    course_find.end_time = event.newEnd;

    const event_backup = this.events.find(event => event.id == course_find!.id);

    this.events = this.events.filter((event) => event.id !== course_find!.id);
    this.addEvent(course_find);

    this.courseService.updateCourse(course_find).subscribe({
      next: course => {
        this.courses.filter((course) => course.id !== course_find!.id);
        this.events = this.events.filter((event) => event.id !== course_find!.id);
        this.addCourse(course);
      },
      error: response => {
        console.log(response);
        course_find!.start_time = start_time_initial;
        course_find!.end_time = end_time_initial;
        this.events = this.events.filter((event) => event.id !== course_find!.id);
        this.events.push(event_backup!);
        this.toastr.error(response.error.error, 'Erreur',{timeOut: 2000});
      }
    });
  }

  endTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.end = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateEnd(newEvent.event.end);
  }

  startTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.start = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateStart(newEvent.event.start);
  }

  updateDateStart(date: Date) {
    this.eventSelectionne.event.start = date;
  }

  updateDateEnd(date: Date) {
    this.eventSelectionne.event.end = date;
  }

  supprimerCours(event: any){
    this.events.splice(this.getIndex(event), 1);
    this.refresh.next();
  }

  getCourseByEventId(eventId: number) {
    return this.courses.find(course => course.id == eventId);
  }

  getRessourcesNameByInitial(initial_resource: string) {
    return this.ressources.find(resource => resource.initial == initial_resource)?.name;
  }
  getRessourcesByInitial(initial_resource: string) {
    return this.ressources.find(resource => resource.initial == initial_resource);
  }

  getTimeString(date: Date) {
    return this.datePipe.transform(date, 'HH:mm');
  }

  getInitialTeacher(id: number) {
    let id_teacher =  this.courses.find(course => course.id == id)?.id_enseignant;
    let teacher = this.teachers.find(teacher => teacher.id == id_teacher);
    return teacher? teacher.staff.initial : "";
  }

  publishCourse(){
    this.courseService.publishCourses().subscribe({
      next:() => {
        this.toastr.success('Les cours ont été publiés', 'Succès',{timeOut: 1500,});
        this.loadEvents();
      },
      error: error => {
        this.toastr.error(error, 'Erreur',{timeOut: 2000});
      }
    });
  }

  cancelCourse(){
    this.courseService.cancelCourses().subscribe({
      next:() => {
        this.toastr.success('Les cours ont été annulés', 'Succès',{timeOut: 1500});
        this.loadEvents()
      },
      error: error => {
        this.toastr.error(error, 'Erreur',{timeOut: 2000});
      }
    });
  }

  generateWeekDays(): Date[] {
    let displayedDates: Date[] = [];
    const start: Date = startOfWeek(this.viewDate, { weekStartsOn: DAYS_OF_WEEK.MONDAY });
    for (let i = 0; i < 7; i++) {
      displayedDates.push(addDays(start, i));
    }
    return displayedDates;
  }

  weekChanged() {
    this.loadEvents();
    this.generateWeekDays();
  }

  receiveArray(arrayData: Course[]): void {
    this.coursesToPaste = arrayData;
  }

  setPasteEnable(bool: boolean){
    this.pasteEnable = bool;
  }

  onChangeSelectedDays(selectedDays: any) {
    this.selectedDays = selectedDays;
  }

  closeModalChoice(){
    this.showModalChoice = false;
    this.courseForEdit = null;
  }

  disablePreventDefault(event: any){
    event.preventDefault();
  }

  redirectToLogout(event: any){
    this.disablePreventDefault(event);
    window.location.href = "/logout";
  }
}