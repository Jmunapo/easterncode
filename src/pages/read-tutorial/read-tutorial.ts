import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-read-tutorial',
  templateUrl: 'read-tutorial.html',
})
export class ReadTutorialPage {
  tutorial = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tutorial = this.navParams.get('tutorial');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReadTutorialPage');
  }

}
