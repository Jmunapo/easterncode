import { Component , NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ChatProvider } from '../../providers/chat/chat';
import { ImagehandlerProvider } from '../../providers/imagehandler/imagehandler';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  username : string;
  avatar:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userservice: UserProvider,
    public zone:NgZone , public alertCtrl: AlertController, public imghandler: ImagehandlerProvider,
    public chatservice: ChatProvider, public loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {
   this.loaduserdetails();
 }

 loaduserdetails() {
   let loader = this.loadingCtrl.create({
     content: 'Loading Profile'
   });
   loader.present();
   this.userservice.getuserdetails().then((res: any) => {
     this.username = res.displayName;
     this.zone.run(() => {
       this.avatar = res.photoURL;
     })
     loader.dismiss();
   })
 }
 logout() {
   this.chatservice.setStatusOffline().then((res)=>{
     if(res){
       firebase.auth().signOut().then(() => {
         this.navCtrl.parent.parent.setRoot('LoginPage');
       })
     }
   })
  }

  editname() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.nickname) {
            this.userservice.updatedisplayname(data.nickname).then((res: any) => {
              if (res.success) {
                statusalert.setTitle('Updated');
                statusalert.setSubTitle('Your username has been changed successfully!!');
                statusalert.present();
                this.zone.run(() => {
                  this.username = data.nickname;
                })
              }

              else {
                statusalert.setTitle('Failed');
                statusalert.setSubTitle('Your username was not changed');
                statusalert.present();
              }

            })
          }
        }

      }]
    });
    alert.present();
  }
  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    this.imghandler.uploadimage().then((url: any) => {
      this.userservice.updateimage(url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.zone.run(() => {
          this.avatar = url;
        })
        }
      }).catch((err) => {
          statusalert.setTitle('Failed');
          statusalert.setSubTitle('Your profile pic was not changed');
          statusalert.present();
      })
      })
  }
}
