import { Component, OnInit } from '@angular/core';
import { HttpService } from '.././http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  questions: any;
  messages: any;
  show: any = {
    questions: false,
    question_form: false,
    messages: false,
    message_form: false,
  };
  question: any;

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router) {
    this.questions = [];
    this.messages = [];

   }

  ngOnInit() {
    this.getQuestions();
    this.getMessages();
  }
  getQuestions(){
    let obs = this._httpService.getQuestions();
    obs.subscribe(data=>{
      this.questions = data;
    });
  }
  getMessages(){
    let obs = this._httpService.getMessages();
    obs.subscribe(data=>{
      this.messages = data;
      this.show.questions = true;
      this.show.messages = true;
    })
  }
  showForm(question){
    this.question = question;
    this.show.question_form = true;
    console.log('question' , question)
  }
  showQuestions(){
    if(this.show.questions == false){
      this.show.questions = true
    }else{this.show.questions = false}
  }
  showMessages(){
    if(this.show.messages == false){
      this.show.messages = true
    }else{this.show.messages = false}
  }
  editQuestion(){
    let obs = this._httpService.editQuestion(this.question);
    obs.subscribe(data => {
      this.getQuestions();
      this.question = { text: '', email: '', answer: ''};
    })
  }
  deleteQuestion(id){
    let obs = this._httpService.deleteQuestion(id);
    obs.subscribe(data => {
      this.getQuestions();
    })
  }
  deleteMessage(id){
    let obs = this._httpService.deleteMessage(id);
    obs.subscribe(data => {
      this.getMessages();
    })
  }

}
