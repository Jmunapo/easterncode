import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-club',
  templateUrl: 'club.html'
})
export class ClubPage {

  homeRoot = 'HomePage'
  eventsRoot = 'EventsPage'
  mapRoot = 'MapPage'
  projectsRoot = 'ProjectsPage'


  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController) {}

  openSettings(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'More',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Settings',
          role: 'destructive',
          icon: 'cog',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'ECC App FAQ',
          icon: 'help-circle',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Close',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
