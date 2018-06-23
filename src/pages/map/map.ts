import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: any;
  infoWindow: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.maps();
  }

  maps(){
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    let $ = this;
    let cntr = { lat: -18.974498, lng: 32.655472 };
    $.map = new google.maps.Map(document.getElementById('map'), {
      center: cntr,
      zoom: 16,
      mapTypeControl: false
    });
    $.infoWindow = new google.maps.InfoWindow;
    directionsDisplay.setMap($.map);

    let image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    let marker = new google.maps.Marker({
      position: cntr,
      title: "22 Dawson St, Mutare. Eastern corders club",
      icon: image
    });

    // To add the marker to the map, call setMap();
    marker.setMap($.map);
    $.infoWindow.open($.map);

    this.calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: { lat: -18.982401, lng: 32.661792 },
      destination: { lat: -18.974498, lng: 32.655472 },
      travelMode: 'WALKING'
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed please reload');
      }
    });
  }

}
