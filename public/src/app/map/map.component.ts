import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: any = {
    zoom: 18,
  }
  show = {
    spots: false,
    street_cleaning: true,
    meter: true,
    other: true,
    garages: false,
    buttons: false,
    settings: false,
    parked: false,
  }
  location = {
    lat: '',
    lng: '',
  }
  now = {
    string: '',
    day: 0,
    hour: 0,
    minutes: 0,
  }
  locationMarker: object = {
    iconUrl : {
      url: 'assets/images/person.png',
      scaledSize: {
        width: 35,
        height: 35,
      },
    },
    draggable: true,
    lat: '',
    lng: '',
  };
  spots: any;
  markers: object = {
    iconUrl : {
      url: 'assets/images/red_icon.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    draggable: true,
    infoWindow: 'new QueryList<AgmInfoWindow>()',
  };
  garages;
  garageMarkers: object = {
    iconUrl : {
      url: 'assets/images/garage_pin.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    draggable: true,
    infoWindow: 'new QueryList<AgmInfoWindow>()',
  };
  parked: object = {
    lat : '',
    lng : '',
  }
  parkedMarker: object = {
    iconUrl : {
      url: 'assets/images/car_logo.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    draggable: true,
    lat: '',
    lng: '',
  };
  types = [
    {name: 'street cleaning', show: false},
    {name: 'meter', show: false},
    {name: 'other', show: false},
    {name: 'garages', show: false},
  ];
  markerObjs = ['street_cleaning', 'meter', 'other'];
  info = [
    {name: 'NO PARKING', info: 'Sign indicates that vehicles may NOT park at this location at any time. You may stop to load/unload packages or merchandise at curbside and you may stop to expeditiously drop off or pick up passengers.', show: false},
    {name: 'STREET CLEANING', info: 'Sign indicates when vehicles may NOT park at this location during certain time period and day. Location is subject to street cleaning regulations. When regulation is in effect, you may stop to load/unload packages or merchandise at curbside and you may stop to expeditiously drop off or pick up passengers.', show: false, popup: 'streetCleaningPopup'},
    {name: 'NO STANDING', info: 'Sign indicates that vehicles may NOT stand at this location. You may not wait or stop to load/unload packages or merchandise at curbside. You may stop to expeditiously drop off or pick up passengers.', show: false},
    {name: 'NO STANDING DURING INDICATED HOURS', info: 'Sign indicates that vehicles may NOT stand at this location during a certain time period on certain day(s). When regulation is in effect, you may only stop to expeditiously drop off or pick up passengers.', show: false},
    {name: 'NO STOPPING', info: 'Sign indicates that vehicles may NOT stop at this location at any time. You may not wait, stop to load/unload packages or merchandise at curbside, or drop off or pick up passengers at this location.', show: false},
    {name: 'BUS STOP', info: 'This location is a designated bus stop. The sign indicates which bus routes stop at this location, their destination and the bus stop address. No standing regulations apply. This means that you may NOT wait or stop to load/unload packages or merchandise at curbside. You may stop to expeditiously drop off or pick up passengers.', show: false},
    {name: 'TAXI STAND', info: 'This location is a designated taxi stand. Only taxis may wait at this location. No standing regulations apply. This means that you may NOT wait or stop to load/unload packages or merchandise at curbside. You may stop to expeditiously drop off or pick up passengers.', show: false},
    {name: 'METERED PARKING', info: 'This sign indicates that you may park your vehicle up to the number of hours indicated in the top left corner of the sign. Payment is required to park at this location. Meters indicate the cost to park at this location and how payment is made. If paying by cash/credit card, a payment receipt must be displayed on vehicle’s dashboard.', show: false},
    {name: 'NO STANDING REGULATION EXCEPT FOR COMMERCIAL/TRUCKS VEHICLES REGULATION', info: 'No standing regulations apply during specified hours except for commercial vehicles or trucks. When regulation is in effect, drivers of other vehicles may only stop to expeditiously drop off or pick up passengers.', show: false},
    {name: 'NO STANDING REGULATION EXCEPT FOR AUTHORIZED AGENCY', info: 'No standing regulations apply during specified hours except for agency specified on sign. When regulation is in effect, drivers of other vehicles may only stop to expeditiously drop off or pick up passengers.', show: false},
  ]
  infoWindow = {
    padding: '0',
    color: 'black',
  }
  spot : {
    contains : [],
    sign: [
      {days: '', time: '', arrows: '', sign: '', image: '', type: '', park: '', category: ''}
    ]
  }
  settings = [
    {name: 'register/login', register: true, login: false},
    {name: 'current spot', number: 0},
    {name: 'previous spots', number: 0},
    {name: 'alerts', number: 0},

  ];
  tutorial = {
    home: {show: false, message: 'click here to view the home page of Street Shure, with FAQs, coming soon and contact information', popup: 'homePopup'},
    info: {show: false, message: 'click here to personalize your settings and create an account for more features', popup: 'infoPopup'},
    location: {show: false, message: 'the person on the map displays your current location, if this is the desired location, click here to get spots. If you would like a different location, first drag the person to the desired location, then click here', popup: 'locationPopup'},
    filters: {show: false, message: 'toggle these buttons to hide and show the desired parking types in the area', popup: 'filtersPopup'},
  }
  temp;
  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router){
  }
  ngOnInit() {
    this.getLocation(this.location, this.locationMarker);
    this.getTime();
  }
  getLocation(location, locationMarker){
      location.lat = 40.69072064707795
      location.lng = -73.98944844972948
      locationMarker.lat = location.lat;
      locationMarker.lng = location.lng;
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(geoSuccess);
    // } else { 
    //   alert('geolocation isnt supoorted in this browser, check your privacy settings')
    // }
    // function geoSuccess(position) {
    //   location.lat = position.coords.latitude;
    //   location.lng = position.coords.longitude;
    //   location_marker.lat = location.lat;
    //   location_marker.lng = location.lng;
    // }
  }
  changeMarker(marker){
    this.show.spots = false;
    this.show.parked = false;
    marker.draggable = true;
    this.inItTypes(false, 'all');
    console.log(marker.lat, 'maker lat')
    console.log('change marker:' , marker)
  }
  stopMarker($event, marker){
    marker.lat = $event.coords.lat;
    marker.lng = $event.coords.lng;
    console.log($event.coords.lng)
  }
  confirmMarker(marker){
    console.log('confirmMarker()')
    var geocoder = new google.maps.Geocoder();  
    var latLng = new google.maps.LatLng(marker.lat, marker.lng);
      if (geocoder) {
        geocoder.geocode({ 'latLng': latLng}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(marker, 'marker');
          }
      })
    }
    marker.draggable = false;
    this.getSpots(marker.lat, marker.lng);
    this.getGarages(marker.lat, marker.lng);
  }
  getSpots(lat, lng){
    let obs = this._httpService.getSpots(lat, lng);
    obs.subscribe(data=>{
      this.makeMarkers(data);
    });
  }
  getGarages(lat, lng){
    let obs = this._httpService.getGarages(lat, lng);
    obs.subscribe(data=>{
      this.garages = data;
    });
  }
  makeMarkers(array){
    console.log('makeMarkers()')
    if(array.length == 0){
      alert('There is currently no data in your current location. Click here to see the areas covered.')
    }else{
      console.log('all info' , array);
      this.spots = [];
      this.spots.push({'coordinates' : array[0].geometry.coordinates, 'signs' : [array[0].properties.SIGNDESC1.toLowerCase()]});
      var current = 0;
      for(var i = 1; i < array.length; i++){
        if(array[i].geometry.coordinates[0] == this.spots[current].coordinates[0] && array[i].geometry.coordinates[1] == this.spots[current].coordinates[1]){
          this.spots[current].signs.push(array[i].properties.SIGNDESC1.toLowerCase());
        }else{
          this.spots.push({'coordinates' : array[i].geometry.coordinates, 'signs' : [array[i].properties.SIGNDESC1.toLowerCase()]})
          current++;
        }
      }
      this.getSpotInfo(this.spots);
    }
  }
  getSpotInfo(spots){
    for(var i = 0; i < spots.length; i++){
      var spot = this.spots[i];
      spot.sign = [];
      spot.contains = [];
      var week = ['mon' , 'tues' , 'wed', 'thurs', 'fri', 'sat', 'sun', 'days'];
      var time = ['am', 'pm', 'anytime'];
      var arrow = ['<' , '>', 'w/', 'arrow', 'single'];
      for(var z = 0; z < spot.signs.length; z++){
        var x  = {days: '', time: '', arrows: '', sign: '', image: '', type: '', park: '', category: '', markers: ''};
        var days = [], times = [], arrows = [];
        var y = spot.signs[z];
        var result = y.split(' ');
        for(var j = 0; j < result.length; j++){
          var str = result[j];
          var test = week.some(el => str.includes(el));
          var time_test = time.some(el => str.includes(el));
          var arrow_test = arrow.some(el => str.includes(el));
          var hyphen = str.includes('-')
          if(test == true){
            if(result[j-1] == "except"){
              str = "except "+str;
              result[j-1] = "";
            }else if(result[j-1] == "&"){
              str = " & "+str;
              result[j-1] = "";
            }else if(result[j-1] == "school"){
              str = "school "+str;
              result[j-1] = "";
            }else if(hyphen == true){
              var a = str;
              var b = a.split('-');
              str = b.join(' ');
            }
            days.push(str);
            result[j] = "" 
          }else if(time_test == true){
            if(hyphen == true){
              var a = str;
              var b = a.split('-');
              str = b.join(' ');
            }
            times.push(str); 
            result[j] = "";
          }else if(arrow_test == true){
            arrows.push(str);
            result[j] = "" 
          }
          x.days = days.join(" ");
          x.time = times.join(" ");
          x.arrows = arrows.join(" ");
          x.sign = result.join(" ");
        }

        var broom = x.sign.includes('broom');
        var meter = x.sign.includes('meter');
        var bus = x.sign.includes('bus');
        var standing = x.sign.includes('standing');
        var parking = x.sign.includes('parking');
        var truck = x.sign.includes('truck');
        var taxi = x.sign.includes('taxi');
        var stopping = x.sign.includes('stopping');
        var star = x.sign.includes('star');
        var school_array = ['education', 'school'];
        var school = school_array.some(el => str.includes(el));
        if(broom == true){
          x.category = "street_cleaning";
          x.type = "STREET CLEANING";
          x.image = "assets/images/signs/street_cleaning.png";
          x.park = "sometimes"
          spot.contains.push('street_cleaning');
        }else if (meter == true){
          x.category = "meter"
          x.type = "METER";
          x.image = "assets/images/signs/commercial.png";
          x.park = "always"
          spot.contains.push('meter');
        }else{
          x.category = "other"
          spot.contains.push('other');
          if (bus == true){
            x.type = "BUS STOP";
            x.image = "assets/images/signs/bus_stop.png";
            x.park = "never";
          }else if (standing == true){
            if(x.time == "anytime"){
              x.type = "NO STANDING ANYTIME";
              x.image = "assets/images/signs/no_standing_anytime.png";
              x.park = "never";
            }else{
              x.type = "NO STANDING";
              x.image = "assets/images/signs/no_standing.png";
              x.park = "sometimes";
            }
          }else if(parking == true){
            if(spot.time == "anytime"){
              x.type = "NO PARKING ANYTIME";
              x.image = "assets/images/signs/no_parking_anytime.png"
              x.park = "never";
            }else{
              x.type = "NO PARKING";
              x.image = "assets/images/question.png"
              x.park = "sometimes";
            }
          }else if(truck == true){
            x.type = "TRUCKS";
            x.image = "assets/images/signs/truck.png";
          }else if(taxi == true){
            x.type = "TAXI"
            x.image = "assets/images/signs/taxi.png"
          }else if(stopping == true){
            x.type = "NO STOPPING";
            x.image = "assets/images/signs/no_stopping.png"
          }else if(star == true){
            if(school == true){
              x.type = "SCHOOL ZONE"
              x.image = "assets/images/signs/school.png";
              x.park = "sometimes";
            }else{
              x.type = "AUTHORIZED VEHICLES ONLY"
              x.image = "assets/images/question.png"
              x.park = "sometimes";
            }
          }else{
            x.type = "?"
            x.image = "assets/images/question.png"
          }
        }if(x.type !== "?"){
          spot.sign.push(x);
        }else{
          console.log('not pushed ?', x)
        }
 
      }
      spot.markers = this.markerObjs.some(el => spot.contains.includes(el))
    }
    console.log(spots, 'updates');
    this.show.spots = true;
    this.show.street_cleaning = true;
    this.show.meter = true;
    this.show.other = true;
    this.inItTypes(true, 'garages');
  }
  inItTypes(change, except){
    for(var i = 0; i < this.types.length; i++){
      if(this.types[i].name == except){
        continue;
      }else{
        this.types[i].show = change;
      }
    }
  }
  spotClick(m){
    for(var x = 0; x < m.sign.length; x++){
      var a = m.sign[x].days.includes('except');
      var days = m.sign[x].days.split(' ');
      var week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      var range = [];
      var extra_days = [];
      if(m.sign[x].days !== ""){
        for(var i = 0; i < days.length; i++){
          var day = days[i];
          for(var j = 0; j < week.length; j++){
            var weekday = week[j];
            var k = weekday.includes(day);
            if(k == true){
              range.push(j);
              extra_days.push(weekday);
            }     
          }
        }
        var b = range.includes(this.now.day);
        if(days.length > 2){
          m.sign[x].days = extra_days.join(' ');
          if(b == true){
            m.sign[x].active = "checktime";
          }else{
            m.sign[x].active = "inactive_opacity"
          }
        }
        else if(days.length == 2){
          if(a == true){
            if(b == true){
              m.sign[x].active = "inactive_opacity";
            }else{m.sign[x].active = "active_opacity";}
          }
          else if(range[0] <= this.now.day && range[1] >= this.now.day){
            m.sign[x].active = "checktime";
          }else{
            m.sign[x].active = "inactive_opacity";
          }
        }else if(days.length == 1){
          if(b == true){
            m.sign[x].active = "checktime"
          }else{
            m.sign[x].active = "inactive_opacity"
          }
        }
      }
      else{
        m.sign[x].active = "active_opacity";
      }
    }
    console.log(m)
    this.checkTime(m);
  };
  clickGarage(g){
    console.log('garage', g)
  };
  getTime(){
    var x = new Date();
    this.now.string = x.toJSON();
    this.now.day = x.getDay();
    this.now.hour = x.getHours();
    this.now.minutes = x.getMinutes();
    console.log('getTime', this.now)
  }
  checkTime(m){
    for(var j = 0; j < m.sign.length; j++){
      if(m.sign[j].active == "checktime"){
        var range = [], minute, hour, h, min;
        if(m.sign[j].time == "" || m.sign[j].time == "anytime"){
          m.sign[j].active = "active_opacity";
        }else{
          var t = m.sign[j].time;
          var time = t.split(' ');
          for(var i = 0; i < time.length; i++){
            var x = time[i];
            if(x == 'noon'){
              x = '12:00'
            }else if(x == 'midnight'){
              if(i == 0){
                x = '0:00'
              }else{x = '24:00'}
            }
            var a = x.endsWith('am');  
            var p = x.endsWith('pm');
            var s = x.slice(0, x.length-2);
            var l = x.includes(':');
            if(l == true){
              var y = s.split(':');
              hour = y[0];
              minute = y[1];
            }else{
              hour = s;
              minute = '00';
            }
            h = Number(hour);
            min = Number (minute);
            if(p == true){
              h+=12;
            }
            range.push({'hour' : h, 'minutes' : min});
          }
        }
        if(range.length > 0){
          if(this.now.hour >= range[0].hour && this.now.hour <= range[1].hour){
            if(this.now.hour == range[1].hour){
              if(this.now.minutes <= range[1].minutes){
                m.sign[j].active = "active_opacity";
              }else{
                m.sign[j].active = "inactive_opacity";
              }
            }else{
              m.sign[j].active = "active_opacity";
            }
          }else{
            m.sign[j].active = "inactive_opacity";
          }
        }
      }
    }
  };


  changeFilters(f){
    if(f.show == true){
      var change = false;
    }else{change = true}
    if(f.name == 'garages'){
      f.show = change;
      this.show.garages = change;
      if(this.show.garages == true){
        this.map.zoom = 12;
      }else{this.map.zoom = 18}
    }else if(f.name == 'street cleaning'){
      f.show = change;
      this.show.street_cleaning = change;
      if(f.show == false){
        this.markerObjs[0] = null;
      }else{
        this.markerObjs[0] = 'street_cleaning'
      }
    }else if(f.name == 'meter'){
      f.show = change;
      this.show.meter = change;
      if(f.show == false){
        this.markerObjs[1] = null;
      }else{
        this.markerObjs[1] = 'meter'
      }
    }else if(f.name == 'other'){
      f.show = change;
      this.show.other = change;
      if(f.show == false){
        this.markerObjs[2] = null;
      }else{
        this.markerObjs[2] = 'other'
      }
    }
    console.log(this.markerObjs);
    for(var i = 0; i <this.spots.length; i++){
      var spot = this.spots[i];
      spot.markers = this.markerObjs.some(el => spot.contains.includes(el))
      if(spot.markers == false){
        console.log(spot, 'false', i)
      }
    }
  }
  parkHere(marker, object){
    object = this.parked;
    object.lat = marker.coordinates[1];
    object.lng = marker.coordinates[0];
    this.show.parked = true;
    console.log('this parked' , this.parked)
  }

  // tutorial hover 
  showAlert(e, x){
    var popup = document.getElementById(x.popup);
    popup.classList.toggle("show");
  }

  // info popup 
  showInfo(e , i){
    var y;
    for(var x = 0; x <this.info.length; x++){
      if(this.info[x].name == i.type){
        y = this.info[x];
        this.temp = y.info;
      }
    }
    var s = 'signInfoPopup'
    console.log('y', y)
    var popup = document.getElementById(s);
    popup.classList.toggle("show");
  }

  // settings dropdown
  showSettingsButtons(){
    if(this.show.buttons == true){
      this.show.buttons = false;
    }else(this.show.buttons = true);
  }
  showSettings(s){
    console.log('showSettings()' , s)
  }
}


