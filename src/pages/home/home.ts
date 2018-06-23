import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { FbProvider } from '../../providers/fb/fb';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  username: string;
  firedata = firebase.database().ref('/chatusers');
  avatar: string;
  notificationcounter: any;
  notiSubs: any;
  topics: any = [];
  choose: any = [];
  tolearn: boolean = false; //Custom Modal
  tolearnOverlay: boolean = false; //Overlay
  selectedTopics: any = [];
  showTopics: boolean  = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FbProvider,
    public userservice: UserProvider, public zone: NgZone, public loadingCtrl: LoadingController,
    public appCtrl: App, public toastCtrl: ToastController ) {
      this.notificationcounter = 0;
  }
  
  ionViewWillLeave() {
    console.log('Leaving');
    this.notiSubs.unsubscribe();
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Loading Profile'
    });
    loader.present();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.getuserdetails(user.uid).then((res: any) => {
          this.username = res.displayName;
          this.zone.run(() => {
            this.avatar = res.photoURL;
          })
          loader.dismiss();
          this.notiSubs = this.fb.object(`counter/note/${user.uid}`).subscribe(val=>{
            if(!isNaN(val.num)){
              this.notificationcounter = val.num;
            }else{
              this.notificationcounter = 0;
            }
            
          })

        })
      }
    });
  }

  ionViewDidLoad() { this.loadTutorialTopics(); }

  loadTutorialTopics(){
    let topics = this.fb.object('tutorial/topic')
    .subscribe(val=>{
      this.topics = Object.keys(val).filter(key => key !== 'key');
      this.topics.forEach(i => {
        this.choose.push(false);
      });
      console.log(this.topics);
      if(val){
        topics.unsubscribe();
      }
    })
    
  }

  openToLearn(){
    this.tolearnOverlay = true;
    setTimeout(()=>{
      this.tolearn = true;
    }, 200);
  }

  selects(howmany){
    this.tolearn = false;
    setTimeout(() => {
      this.tolearnOverlay = false;
      this.selectedTopics = [];
      if (howmany === 'some') {
        this.topics.forEach(element => {
          let i = this.topics.indexOf(element);
          if (this.choose[i]) {
            this.selectedTopics.push(element);
          }
        });
        if(this.selectedTopics.length > 0){
          this.navCtrl.push('LearnPage', {
            data: this.selectedTopics
          })
        }else{
          let toaster = this.toastCtrl.create({
            message: 'Nothing selected',
            duration: 3000,
            position: 'bottom'
          });
          toaster.present();
        }
      } else {
        this.navCtrl.push('LearnPage', {
          data: this.topics
        })
      }
    }, 500);
  }

  topicChanged(topic, i){
    //console.log(topic);
    //console.log(this.topics[i])
  }

  profile(){
    this.navCtrl.push('ProfilePage');
  }

  

  getuserdetails(uid) {
    var promise = new Promise((resolve, reject) => {
      this.firedata.child(uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  open(page){
    this.navCtrl.push(page);
  }

  root(page) {
    this.appCtrl.getRootNav().setRoot(page);
  }

}
