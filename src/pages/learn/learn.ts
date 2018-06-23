import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FbProvider } from '../../providers/fb/fb';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-learn',
  templateUrl: 'learn.html',
})
export class LearnPage {
  firedata = firebase.database().ref('/tutorial')
  topics: any = [];
  tutorials = [];
  loading = false;
  alldataloaded = false;
  notready: boolean = true;
  referenceToOldestKey = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FbProvider) {
    this.topics = this.navParams.get('data');
    console.log(this.topics);
  }

  ionViewDidLoad() {
    this.topics.forEach(element => {
      this.initialiseTutorials(element);
    });
    console.log(this.tutorials);
  }

  initialiseTutorials(subject){
    this.firedata.child(subject)
      .orderByKey()
      .limitToLast(2)
      .once('value')
      .then((snapshot) => {
        let data = snapshot.val();
        let arrayOfKeys = Object.keys(data).sort().reverse();
        let results = arrayOfKeys.map((key) => data[key]);
        this.tutorials.push(results);

        let last = {
          subject: subject,
          lastKey: arrayOfKeys[arrayOfKeys.length - 1]
        }

        this.referenceToOldestKey.push(last);
        this.notready = false;
      })
      .catch((error) => {
        console.log(error)
      });
  }

  loadMoreTutorials(){
    console.log('loadMoreTutorials')
    this.loading = true;
    let c = 0;
    this.referenceToOldestKey.forEach((element,i) => {
      let last = element.lastKey;
      if (element.lastKey !== undefined){
        this.firedata.child(element.subject)
          .orderByKey()
          .endAt(last)
          .limitToLast(3)
          .once('value')
          .then((snapshot) => {
            let data = snapshot.val();
            let arrayOfKeys = Object.keys(data).sort().reverse().slice(1);
            let results = arrayOfKeys.map((key) => data[key]);
            const index = this.tutorials.findIndex(topic => topic[0].subject === element.subject);
            this.tutorials[index] = this.tutorials[index].concat(results);
            this.referenceToOldestKey[i] = {
              subject: element.subject,
              lastKey: arrayOfKeys[arrayOfKeys.length - 1]
            }
            c++;
            if (c === this.referenceToOldestKey.length){
              this.loading = false;
              this.anyMore();
            }
          })
          .catch((error) => {
            c++;
            console.log(error)
            if (c === this.referenceToOldestKey.length) {
              this.loading = false;
              this.anyMore();
            }
            
          });

      }else{
        c++;
        if (c === this.referenceToOldestKey.length) {
          this.loading = false;
          this.anyMore();
        }
      }

    });

  }

  anyMore(){
    let test = this.referenceToOldestKey.filter(k => k.lastKey === undefined);
    if (test.length === this.referenceToOldestKey.length) {
      this.alldataloaded = true;
      console.log('Nothing else left');
      return;
    }
  }

  

  viewTutorial(tutorial){
    console.log(tutorial);
    this.navCtrl.push('ReadTutorialPage', {
      tutorial: tutorial
    })
  }

}
