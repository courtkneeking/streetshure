import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http:HttpClient) { 

  }
  getSpots(lat, lng){
    return this._http.get('/spots/'+lat+'/'+lng);
  }
  getGarages(lat, lng){
    return this._http.get('/garages/'+lat+'/'+lng);
  }
  getQuestions(){
    return this._http.get('/questions');
  }
  getMessages(){
    return this._http.get('/messages');
  }
  addQuestion(question){
    return this._http.post('/questions', question);
  }
  addMessage(message){
    return this._http.post('/messages', message);
  }
  editQuestion(question){
    return this._http.put('/questions/'+question._id, question);
  }
  deleteQuestion(id){
    return this._http.delete('/questions/'+id);
  }
  deleteMessage(id){
    return this._http.delete('/messages/'+id);
  }

}
