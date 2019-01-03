var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1:27017/streetshure', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost/streetshure', { useNewUrlParser: true });
var db = mongoose.connection;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public', 'dist', 'public')));

var SpotSchema = new mongoose.Schema({ 
    properties: Object, geometry: Object}, 
    { collection : 'newyork' });   

var Spot = mongoose.model('Spot', SpotSchema);

var GarageSchema = new mongoose.Schema({ 
    properties: Object, geometry: Object}, 
    { collection : 'newyork_garages' });   

var Garage = mongoose.model('Garage', GarageSchema);

var QuestionSchema = new mongoose.Schema({
    email:{type:String},
    text: {type:String},
    answer: {type:String}
}, {timestamps:true},  { collection : 'questions' })

var Question = mongoose.model('Question', QuestionSchema);

var MessageSchema = new mongoose.Schema({
    email:{type:String},
    text: {type:String},
}, {timestamps:true} , { collection : 'messages' })

var Message = mongoose.model('Message', MessageSchema);

app.get('/spots/:lat/:lng', (req, res)=>{
    var coords = [Number(req.params.lng), Number(req.params.lat)]
    Spot.find( { "geometry.coordinates" : { $geoWithin : { "$center" : [coords, 0.001] } } } , (err, spot)=>{
        res.json(spot);
    })
});
app.get('/garages/:lat/:lng', (req, res)=>{
    console.log('location server' , req.params.lat, req.params.lng);
    var coords = [Number(req.params.lng), Number(req.params.lat)]
    Garage.find( {} , (err, garage)=>{
        res.json(garage);
    })
});
app.get('/questions', (req, res)=>{
    Question.find({}, (err, questions)=>{
        console.log('server get questions' , questions)
        res.json(questions);
    })
});
app.get('/messages', (req, res)=>{
    Message.find({}, (err, messages)=>{
        console.log('server get messagers' , messages)
        res.json(messages);
    })
});

app.post('/questions', (req,res)=>{
    console.log('server post question', req.body);
    var question = new Question(req.body);
    question.save((err, savedQuestion) => {
        if (err) {
            console.log(err);
        } else {
            res.json(savedQuestion);
        }
    })
});
app.post('/messages', (req,res)=>{
    console.log('server post new message', req.body);
    var message = new Message(req.body);
    message.save((err, savedMessage) => {
        if (err) {
            console.log(err);
        } else {
            res.json(savedMessage);
        }
    })
});
app.put('/questions/:id', (req, res)=>{
    Question.findByIdAndUpdate(req.params.id, req.body, (err, confirmation)=>{
        if(err){
            console.log(err);
        }else{
            res.json({success: 'You succesfully updated this task.'})
        }
    })
});
app.delete('/questions/:id', (req, res)=>{
    Question.remove({_id:req.params.id}, (err)=>{
        if(err){
            console.log(err)
        }else{
            res.json({success: 'You successfully deleted this task.'})
        }
    })
})
app.delete('/messages/:id', (req, res)=>{
    Message.remove({_id:req.params.id}, (err)=>{
        if(err){
            console.log(err)
        }else{
            res.json({success: 'You successfully deleted this task.'})
        }
    })
})

app.listen(3000, function(){
    console.log('3000')
});