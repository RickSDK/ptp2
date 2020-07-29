import { Component, OnInit } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';

@Component({
  selector: 'app-casino-locator',
  templateUrl: './casino-locator.component.html',
  styleUrls: ['./casino-locator.component.scss']
})
export class CasinoLocatorComponent extends BaseHttpComponent implements OnInit {
  public segments = ['10 mi', '25 mi', '100 mi'];
  public position: any;
  public miles: number = 10;
  public totalCasinos: number = 0;
  public displayCasinos: any[] = [];

  constructor() { super(); }

  ngOnInit(): void {
    this.getLocation();
  }
  segmentChanged(num: number) {
    this.buttonIdx = num;
    this.miles = 10;
    if (num == 1)
      this.miles = 25;
    if (num == 2)
      this.miles = 100;
    this.getLocation();
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        data => { this.showPosition(data); },
        this.showError, {
        enableHighAccuracy: true
        , timeout: 5000
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
  showPosition(position: any) {
    this.position = position;
    if (position && position.coords) {
      var params = {
        Username: 'test@test.com',
        Password: 'test',
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        distance: this.miles
      }
      this.executeApi('pokerCasinoLookup.php', params);
    }
  }
  showError(error: any) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }
  postSuccessApi(filename: string, data: any) {
    var latitude = this.position.coords.latitude;
    var longitude = this.position.coords.longitude;
    var distance = this.miles;
    var casinos = data.split("<li>");
    var x = 0;
    this.filteredGames = [];
    var totalCasinos = 0;
    var displayCasinos: any[] = [];
    casinos.forEach(function (casino: any) {
      if (x++ <= 1) {
        totalCasinos = parseInt(casino);
      } else {
        var casObj = addCasinoFromLine(casino, latitude, longitude);
        if (casObj.name && casObj.distanceKm && casObj.distance <= distance)
          displayCasinos.push(casObj);
        console.log(casObj);
      }
    });
    displayCasinos.sort((curr: any, next: any) => {
      return curr.distanceKm < next.distanceKm ? -1 : 1;
    });
    this.displayCasinos = displayCasinos;
    this.totalCasinos = totalCasinos;
    if (this.displayCasinos.length == 0)
      this.showAlertPopup('no casinos found');
  }
}

function addCasinoFromLine(line: string, latitude: string, longitude: string) {
  var components = line.split("|");
  var name = components[1];
  var city = components[2];
  var state = components[3];
  var type = components[4];
  var indian = components[5];
  var lat = components[6];
  var lng = components[7];
  var street = components[8];
  var zip = components[9];
  var phone = components[10];
  var country = components[11];
  var address = globalAddress(city, state, country);
  var distanceKm = getDistanceFromLatLonInKm(parseFloat(lat), parseFloat(lng), parseFloat(latitude), parseFloat(longitude));
  var distance = Math.round(distanceKm / 1.609);
  var img = (type == 'Casino') ? 'casino.jpg' : 'cardroom.jpg';
  if (indian == 'Y')
    img = 'indian.png';
  return {
    name: name,
    topRight: type,
    botLeft: address,
    botRight: distance + ' mi',
    street: street,
    city: city,
    state: state,
    zip: zip,
    country: country,
    phone: phone,
    lat: lat,
    lng: lng,
    img: img,
    type: type,
    indian: indian,
    distanceKm: distanceKm,
    distance: distance
  };

}
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}
function globalAddress(city: string, state: string, country: string) {
  if (country == 'USA')
    return city + ', ' + state;
  else
    return city + ', ' + country;
}