import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FbProvider } from '../../providers/fb/fb';
import firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-notif-chats',
  templateUrl: 'notif-chats.html',
})
export class NotifChatsPage {
  current: string = '';
  notifications: any = [];
  notifSub: any;
  user: string = '';
  nothingArrived: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private fb: FbProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController,) {
    this.current = 'notifications';
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user.uid;
        this.notifSub = this.fb.get_list(`notifications/${user.uid}`)
        .subscribe(val=> {
          this.notifications = val.reverse();
          if(val.length > 0){
            this.nothingArrived = false;
          }else{
            this.nothingArrived = true;
          }
          console.log(this.notifications);
        })
      }})
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifChatsPage');
  }

  back(){
    this.navCtrl.pop();
  }
  ionViewWillLeave() {
    console.log('Leaving');
    this.notifSub.unsubscribe();
  }

  noteAction(note){
    console.log(note)
    let confirm = this.alertCtrl.create({
      title: 'Notification Body',
      message: this.capitalizeFirstLetter(note.body),
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.fb.remove(`notifications/${this.user}`, note.key)
              .then(()=>{
                console.log('Data Deleted');

              })
              .catch(err=>{
                console.log('Error on delete', err)
              })
          }
        },
        {
          text: 'Close',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    if(!note.read){
      this.readReport(note);
    }
    confirm.present();
  }

  readReport(note){
    this.fb.update(`notifications/${this.user}/`, note.key,{read: 1 })
    .then(()=>{
      console.log('Update Done');
    })
    .catch(err=>{
      console.log('Failed', err);
    })
  }

  capitalizeFirstLetter(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
