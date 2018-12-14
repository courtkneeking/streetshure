import { Component, OnInit } from '@angular/core';
import { HttpService } from '.././http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  types = [
    {name: 'About Site', show: false},
    {name: 'FAQs', show: false},
    {name: 'Coming Soon', show: false},
    {name: 'Contact', show: false}
  ];
  show = {
    logo: true,
  }
  questions: any;
  messages: any;
  newQuestion: any;
  newMessage: any;
  editQuestion;
  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router) { 
    this.questions = [];
    this.messages = [];
    this.newQuestion = {email: '', text: '', anwswer: ''};
    this.newMessage = {email: '', text: ''};
    this.editQuestion = {email: '', text: '', answer: ''}
  }


  ngOnInit() {
    this.getQuestions();
    this.getMessages();
  }
  changeTypes(t){
    this.show.logo = false;
    for(var i = 0; i < this.types.length; i++){
      if(this.types[i].name !== t.name){
        this.types[i].show = false;
      }else{
        this.types[i].show = true;
      }
    }
  }
  getQuestions(){
    let obs = this._httpService.getQuestions();
    obs.subscribe(data=>{
      console.log(data);
      this.questions = data;
    })
  }
  getMessages(){
    let obs = this._httpService.getMessages();
    obs.subscribe(data=>{
      console.log(data);
      this.messages = data;
    })
  }
  addMessage(){
    let obs = this._httpService.addMessage(this.newMessage);
    obs.subscribe(data => {
      this.getMessages();
      this.newMessage = { email: '', text: '' };
    })
  }
  addQuestion(){
    let obs = this._httpService.addQuestion(this.newQuestion);
    obs.subscribe(data => {
      this.getQuestions();
      this.newQuestion = { email: '', text: '' , answer: ''};
    })
  }
}