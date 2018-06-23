import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import firebase from 'firebase';
import { FbProvider } from '../../providers/fb/fb';


@IonicPage()
@Component({
  selector: 'page-letstalkabout',
  templateUrl: 'letstalkabout.html',
})
export class LetstalkaboutPage {
  @ViewChild('content') content: Content;
  talks: Array<any> = [{message: 'welcome'}];
  userdata = {
    uid: '',
    name: ''
  }
  type = 'Group Chat';
  message: string = '';
  talkSubs: any;
  talkRefData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FbProvider) {
    this.talkRefData = this.navParams.get('data');
    if (this.talkRefData){
      console.log(this.talkRefData);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.userdata.name = user.displayName;
          this.userdata.uid = user.uid;
        }})
        this.loadTalks();
        this.scrollto();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LetstalkaboutPage');
  }

  ionViewWillLeave() {
    console.log('Leaving');
    this.talkSubs.unsubscribe();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  loadTalks(){
   this.talkSubs = this.fb.get_list(this.talkRefData.path)
      .subscribe(val => {
        console.log(val);
        if(val.length > 0){
          this.talks = val;
        }else{
          this.startTheTalk();
        }
      })
  }

  sendMessage(){
    let sms = {
      sentby: this.userdata.uid,
      name: this.userdata.name,
      message: this.message,
      itemid: this.talkRefData.itemid,
      timestamp: firebase.database['ServerValue']['TIMESTAMP']
    }
    this.message = '';
    this.fb.push(this.talkRefData.path, sms)
    .then(v=>{
      this.content.scrollToBottom();
    })
  }
  startTheTalk(){
    let myTalk = {
      sentby: this.userdata.uid,
      name: this.userdata.name,
      itemid: this.talkRefData.itemid,
      message: `Lets talk about ${this.talkRefData.title}`,
      timestamp: firebase.database['ServerValue']['TIMESTAMP']
    }
    this.fb.push(this.talkRefData.path, myTalk)
     .then(v=>{
       if (this.userdata.uid !== this.talkRefData.by) {
         setTimeout(() => {
           this.sentNotification(`LTA ${this.talkRefData.title}`, `${this.userdata.name} says let's talk about your ${this.talkRefData.title},
        open your project and click comments/chat to chat`, this.talkRefData.by);
         }, 1000);
       } 
     });
   }



  sentNotification(title: string, body: string, uid) {
    let note = {
      title: title,
      body: body,
      itemid: uid,
      addedon: firebase.database['ServerValue']['TIMESTAMP'],
      by: {
        uid: this.userdata.uid,
        name: this.userdata.name,
      }
    }
    this.fb.push(`notifications/${uid}`, note)
      .then(() => {
        console.log(note);
      })
      .catch(err => {
        console.log(err);
      })
  }

}
