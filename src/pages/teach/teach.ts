import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import * as linkify from 'linkifyjs';
import linkifyStr from 'linkifyjs/string';
import { NewUserProvider } from '../../providers/new-user/new-user';
import { ViewChild } from '@angular/core';
import { FbProvider } from '../../providers/fb/fb';
import linkifyHtml from 'linkifyjs/html';
import firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-teach',
  templateUrl: 'teach.html',
})
export class TeachPage {
  @ViewChild('myfab') myfab: FabContainer;
  @ViewChild('fab') fab: FabContainer;

  welcome = [false, false, false];
  userdata = {
    name: 'User',
    uid: ''
  }

  //Editor state
  indent = false;
  paragraph = true;
  italicactive = false;
  boldactive = false;

  inputElem: any; //Input
  previewdata = ''; 
  preview = false;
  articletitle = 'Article'; //article title
  articleSubject = '';
  typing: boolean = false;
  welcomeDbData: any = {};
  welcomeData = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbProvider, public nu: NewUserProvider,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, private fb: FbProvider, public alertCtrl: AlertController) {
    this.previewdata = `This is where you will preview your content`
    this.welcomeData = this.nu.teach();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userdata.uid = user.uid;
        this.userdata.name = user.displayName;
      }else{
        this.navCtrl.setRoot('LoginPage');
      }
    })
  }

  ionViewDidLoad() {
    this.inputElem = document.getElementById("type-here");
    this.inputElem.onfocus = this.myFab();
    this.db.getData('welcome').then(data=>{
      if(!data){
        setTimeout(()=>{
          this.welcome[0] = true;
        }, 1000)
      }else if(data){
        this.welcomeDbData = data;
        this.welcome = data.teach;
        setTimeout(()=>{
          this.selectSubject();
        },1000)
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }

  welcomeNav(curr, nxt){
    this.welcome[curr] = false;
    setTimeout(() => {
      this.welcome[nxt] = true;
      console.log(this.welcome)
    }, 1000)
  }
  welcomeFinish() {
    this.welcome = [false, false, false];
    this.welcomeDbData.teach = this.welcome;
    this.db.setData('welcome', this.welcomeDbData)
      .then(()=>{
        console.log('Data saved');
      })
      .catch(err=>{
        console.log('Error saving', err);
        this.welcome = [false, false, false];
      })
  }
  welcomeSkip(i){
    if(this.fab._listsActive){
      this.fab.close();
    }
    this.welcome = (i === 1) ? [false, false, false] : [true, false, false];
  }

  switchTyping(){
    this.fab.close();
    this.myfab.toggleList();
    this.typing = !this.typing;
    this.inputElem.contentEditable = `true`;
    this.inputElem.focus();
  }

  previewArticle(){
    this.fab.close();
    this.myfab.close();
    if (this.inputElem.innerHTML !== ''){
      let options = {/* … */ };
      this.previewdata = linkifyHtml(this.inputElem.innerHTML, options);
      console.log(this.previewdata)
      console.log(this.inputElem.innerHTML)
    }
    this.preview = true;
  }
  closePreview(){
    this.preview = false;
    this.inputElem.focus();
  }

  onBlur(event){
    //this.inputElem.focus();
  }
  onPaste(event) {
    let elem = event.target;
    elem.style.backgroundColor = "";
    elem.style.opacity = "";
    console.log(event);
  }

  gotoHome(){
    this.navCtrl.setRoot('ClubPage');
  }


  edit(command, val = null){
    if (command === 'formatblock') { this.paragraph = !this.paragraph; }
    if (command === 'indent' || command === 'outdent') { this.indent = !this.indent; }
    if (command === 'bold') { this.boldactive = !this.boldactive }
    if (command === 'italic') { this.italicactive = !this.italicactive }
    document.execCommand(command, false, val);
    this.inputElem.focus();
  }

  saveDocument(){
    let loader = this.loadingCtrl.create({
      content: 'Submitting article...'
    });
    loader.present();

    this.fab.close();
    this.myfab.close();
    if (this.inputElem.innerHTML !== '' && this.articleSubject !== ''){
      let options = {/* … */ };
      let postData = linkifyHtml(this.inputElem.innerHTML, options);
      console.log(postData);
      let data = {
        title: this.articletitle,
        article: postData,
        subject: this.articleSubject,
        tutor: this.userdata,
        timestamp: firebase.database['ServerValue']['TIMESTAMP']
      }
      this.fb.push(`tutorial/${data.subject}`,data)
        .then(val=>{
          console.log(val);
          this.inputElem.innerHTML = '';
          this.addSubject(data.subject);
          this.navCtrl.setRoot('ClubsPage');
          loader.dismiss();
        })
        .catch(err=>{
          console.log('Error Occured', err);
          loader.dismiss();
        })
    }
  }
  addSubject(subject){
    this.fb.set('tutorial/topic', subject, subject)
    .then((v)=>{
      console.log(v);
    })
    .catch(err=>{
      console.log('Occured an error', err);
    })
  }


  myFab(){
    if (!this.myfab._listsActive) {
      this.myfab.toggleList();
    }
  }

  selectSubject() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Area/Subject');

    alert.addInput({
      type: 'radio',
      label: 'JavaScript',
      value: 'JavaScript',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Nodejs',
      value: 'Nodejs'
    });

    alert.addInput({
      type: 'radio',
      label: 'HTML5',
      value: 'HTML5'
    });

    alert.addInput({
      type: 'radio',
      label: 'CSS',
      value: 'CSS'
    });

    alert.addInput({
      type: 'radio',
      label: 'Raspberry Pi',
      value: 'Raspberry Pi'
    });

    alert.addInput({
      type: 'radio',
      label: 'JavaScript Frameworks',
      value: 'JavaScript Frameworks'
    });

    alert.addInput({
      type: 'radio',
      label: 'Other',
      value: 'other'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'other') {
          this.newSubject()
        } else {
          this.articleSubject = data;
          this.newArticle()
        }
      }
    });
    alert.present();
  }


  newArticle(data='') {
    let edit = (data === '')?  '' : this.articletitle;
    let msg = (data === '') ? 'Please provide Article title' : 'Edit title';

    let prompt = this.alertCtrl.create({
      message: msg,
      inputs: [
        {
          name: 'title',
          type: 'textarea',
          placeholder: `Enter article title`,
          value: edit
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.title !== '') {
              this.inputElem.contentEditable = `true`;
              this.articletitle = data.title;
              this.inputElem.focus();
            } else {
              this.newArticle()
            }
          }
        }
      ]
    });
    prompt.present();
  }


  newSubject(){
    let prompt = this.alertCtrl.create({
      message: `Enter Area/Subject you want to write about`,
      inputs: [
        {
          name: 'subject',
          placeholder: `Area or Subject`
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.subject !== '') {
              this.articleSubject = data.subject;
              this.newArticle()
            } else {
              this.newSubject()
            }
          }
        }
      ]
    });
    prompt.present();
  }
  

}
