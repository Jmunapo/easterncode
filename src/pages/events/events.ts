import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { FbProvider } from '../../providers/fb/fb';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  data: any;
  firedata = firebase.database().ref('/events/events');
  selectedDate: any = {
    date: Number, month: Number, year: Number
  }
  currentEvents = [];
  hasEvent: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private fb: FbProvider,) {
    this.getEvents().then((res: any) => {
      this.currentEvents = res;
    })
  }

  ionViewDidLoad() {
    
  }

  getEvents() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('month').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  onDaySelect(e){
    this.selectedDate.date = e.date;
    this.selectedDate.year= e.year;
    this.selectedDate.month = e.month;
    this.selectedDate.events = [];
    let index = this.currentEvents.findIndex(d => d.date === e.date && d.month === e.month);
    this.hasEvent = e.hasEvent;
    if(index > -1){
      this.selectedDate.events = this.currentEvents[index].events;
    }

    console.log(this.selectedDate);
  }

  onMonthSelect(e){
    console.log(e);
  }

  addEvent(){
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: `Add Event - ${this.getMon(this.selectedDate.month)} ${this.selectedDate.date}`,
      inputs: [{
        name: 'title',
        placeholder: 'Title'
      }, {
          name: 'description',
          placeholder: 'Description'
        }, {
          name: 'time',
          type: 'time'
        }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Save',
        handler: data => {
          let loader = this.loadingCtrl.create({
            content: 'Please wait'
          });
          loader.present();
          if (data.title !== '' && data.description !== '' && data.time !== ''){
            if (this.createEvent(data)){
              this.currentEvents = this.currentEvents.sort((a, b) => parseFloat(a.month) - parseFloat(b.month));
              this.fb.set(`events`, 'events', this.currentEvents)
                .then(val=>{
                  console.log(val)
                  loader.dismiss();
                  statusalert.setSubTitle('Event has been added successfully!!');
                  statusalert.present();
                })
                .catch(err=> {
                  console.log(err)
                  loader.dismiss();
                })
            }
          }else{
            statusalert.setSubTitle('Event was not added');
            statusalert.present();
            loader.dismiss();
          }
        }

      }]
    });
    alert.present();
  }

  getMon(mon){
    let monNames = ['Jan','Feb','Mar','Apr', 'May', 'Jun', 'Jul','Aug' , 'Sep', 'Oct', 'Nov', 'Dec']
    return monNames[mon];
  }

  createEvent(data){
    let evnt = { title: data.title, description: data.description, time: data.time }
    let newDate = {
      year: this.selectedDate.year,
      month: this.selectedDate.month,
      date: this.selectedDate.date,
      events: [evnt]
    }
    let index = this.currentEvents.findIndex(d => d.date === this.selectedDate.date && d.month === this.selectedDate.month);
    if(index > -1){
      this.currentEvents[index].events.push(evnt);
      return true;
    }else{
      this.currentEvents.push(newDate);
      return true;
    }
  }

  

}
