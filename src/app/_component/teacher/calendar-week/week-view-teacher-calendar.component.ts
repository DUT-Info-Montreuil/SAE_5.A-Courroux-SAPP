import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
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
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { RoomService } from 'src/app/_service/room.service';
import { Promotion } from 'src/app/_model/entity/promotion.model';
import { PromotionService } from 'src/app/_service/promotion.service';
import { ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/_model/entity/user.model';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@Component({
  selector: 'app-calendar-week-view-teacher',
  templateUrl: './week-view-teacher-calendar.component.html',
  styleUrls: ['./week-view-teacher-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class WeekViewTeacherCalendarComponent implements OnInit {

  @Input() user: User;

  courses: Course[] = [];
  teachers: Teacher[] = [];
  salles: any[] = [];
  ressources: Resource[] = [];
  groupes: Group[] = [];
  promos: Promotion[] = [];

  courseForEdit: Course;

  isWeekCalendar = true;
  viewPhone = false;

  args: any[] = [];

  public eventSelectionne: any = null;

  idUser: any;

  showModalMod = false;
  showModalAdd = false;
  showModalStats = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];
  eventsToPushToBd: CalendarEvent[] = [];

  isDrawerOpen = false;

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
    private promotionService: PromotionService
  ) {}

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateView();
  }

  private updateView(): void {
    const largeurEcran = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.isWeekCalendar = largeurEcran > 690;
    this.viewPhone = largeurEcran > 690;
  }

  ngOnInit(): void {
    this.updateView();
    forkJoin([
      this.teacherService.getTeachers(), 
      this.roomService.getSalles(), 
      this.resourceService.getResources(), 
      this.groupService.getGroups(),
      this.promotionService.getPromotions()

    ]).subscribe({
      next: data  => {
        this.teachers = data[0]
        this.salles = data[1]
        this.ressources = data[2]
        this.groupes = data[3]
        this.promos = data[4]
        this.loadEvents();
      },
      error :error => {
        console.log(error);
      }
    });
  }

  toggleWeekCalendar(){
    this.isWeekCalendar = !this.isWeekCalendar;
  }

  changeViewDay(event : any){
    this.viewDate = new Date(event.day.date);
    this.toggleWeekCalendar();
  }

  openModalMod(eventId: number) {
    this.courseForEdit = this.getCourseByEventId(eventId)!;
    this.showModalMod = true;
  }
  
  closeModalMod() {
    this.showModalMod = false;
    this.eventSelectionne.event.start = Date.parse(this.eventSelectionne.event.start);
    this.eventSelectionne.event.end = Date.parse(this.eventSelectionne.event.end);
  }

  openModalAdd() {
    this.showModalAdd = true;
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }

  addArguments(args: any){
    //supprimer les arguments deja existant
    this.args = this.args.filter(arg => Object.keys(arg)[0] != Object.keys(args)[0]);
    this.args.push(args);
  }

  loadEvents(){
    if (this.args.length > 2 && this.args.find(arg => Object.keys(arg)[0] == "method") == undefined){
      this.args.push({method: "filter"});
    }
    this.events = [];

    let day = this.viewDate.getDay();
    let diff = this.viewDate.getDate() - day + (day == 0 ? -6:1);
    let date_temp = new Date(this.viewDate);
    let monday = new Date(date_temp.setDate(diff));
    let friday = new Date(date_temp.setDate(diff + 4));
    this.addArguments({date_min: format(monday, 'yyyy-MM-dd')});
    this.addArguments({date_max: format(friday, 'yyyy-MM-dd')});

    this.courseService.getCourses(this.args).subscribe({
      next : courses => {
        this.courses = courses;
        this.events = [];
        for (let course of courses) {
          this.addEvent(course);
        }
        this.refresh.next();

      },
      error: error => {
        console.log(error);
      }
    });
  }

  addCourse(course: Course) {
    this.courses.push(course);
    this.addEvent(course);
  }

  addEvent(course: Course): void {
    let cssClass : string;
    if (this.args.find(arg => Object.keys(arg)[0] == "group") != undefined){
      cssClass = `calendar-user-position-${this.getPosition(course)} calendar-user-width-${this.getWidth(course)}`;
    }
    else {
      cssClass = ``;
    }

    this.events.push({
      id: course.id,
      title: course.initial_ressource,
      start: new Date(course.start_time),
      end: new Date(course.end_time),
      color: {
        primary: "#FFFFFF",
        secondary: this.getResourceByInitial(course.initial_ressource)!.color,
      },        
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      cssClass: cssClass
    });
  }

  getWidth(course: Course): number {
    let group = this.groupes.find(group => group.id == course.id_group);
    let width = 100
    while (group && group.id_group_parent != null){
      const groupsInParent = this.groupes.filter(group_curr => group_curr.id_group_parent == group!.id_group_parent);
      width = width / groupsInParent.length;
      group = this.groupes.find(group_curr => group_curr.id == group!.id_group_parent);
    }
    return Math.ceil(width)
  }

  getPosition(course: Course): number {
    let group = this.groupes.find(group => group.id == course.id_group);
    let pourcents: any[] = []
    while (group && group.id_group_parent != null){
      const groupsInParent = this.groupes.filter(group_curr => group_curr.id_group_parent == group!.id_group_parent);
      const index = groupsInParent.indexOf(group!);
      pourcents.push({index: index, length: groupsInParent.length})
      group = this.groupes.find(group_curr => group_curr.id == group!.id_group_parent);
    }
    let left = 0
    if (pourcents.length > 0){
      const last = pourcents.pop()
      let parentPourcent = 100 / last.length
      left = last.index * parentPourcent
      
      for (let item of pourcents.reverse()){
        parentPourcent = parentPourcent / item.length
        left = left + item.index * parentPourcent
      }
    }
    return Math.ceil(left);
  }

  removeCourse(course_remove: Course): void {
    this.courses = this.courses.filter((course) => course.id !== course_remove.id);
    this.events = this.events.filter((event) => event.id !== course_remove.id);
  }

  eventClicked(event: any) {
    this.eventSelectionne = event;
  
    Promise.all([this.loadEventStart(this.eventSelectionne), this.loadEventEnd(this.eventSelectionne)])
      .then(([loadedEventStart, loadedEventEnd]) => {
        this.updateDateStart(loadedEventStart);
        this.updateDateEnd(loadedEventEnd);
        this.openModalMod(this.eventSelectionne.event.id);
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

  onSubmitMod(){
    this.closeModalMod();
  }

  eventTimesChanged(event: any) {
    console.log("here")
    let course_find = this.courses.find(course => course.id == event.event.id);
    if (!course_find){
      return;
    }
    
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
    this.eventSelectionne.event.start = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
  }

  updateDateEnd(date: Date) {
    this.eventSelectionne.event.end = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
  }

  supprimerCours(event: any){
    this.events.splice(this.getIndex(event), 1);
    this.refresh.next();
    this.closeModalMod();
  }

  getCourseByEventId(eventId: number) {
    return this.courses.find(course => course.id == eventId);
  }

  getRessourceNameByInitial(initial_resource: string) {
    return this.ressources.find(resource => resource.initial == initial_resource)?.name;
  }
  getResourceByInitial(initial_resource: string) {
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
        this.loadEvents()
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

  filterByPromo(event: any){
    const promo = this.promos.find(promo => promo.id == event.target.value)!
    const arg = {group: promo.group.id};
    this.addArguments(arg);
    this.loadEvents();
  }

  filterByRoom(event: any){
    const arg = {room: event.target.value};
    this.addArguments(arg);
    this.loadEvents();
  }

  filterByTeacher(event: any){
    const arg = {teacher: event.target.value};
    this.addArguments(arg);
    this.loadEvents();
  }

  removeFilter(key: string, select: any){
    this.args = this.args.filter(arg => Object.keys(arg)[0] != key);
    if (this.args.length <= 3){
      this.args = this.args.filter(arg => Object.keys(arg)[0] != 'method');

    }
    this.loadEvents();
    select.value = "";
  }

  openModalStats() {
    this.showModalStats = true;
  }

  closeModalStats() {
    this.showModalStats = false;
  }

  disablePreventDefault(event: any){
    event.preventDefault();
  }
  
  redirectToLogout(event: any){
    this.disablePreventDefault(event);
    window.location.href = "/logout";
  }
}