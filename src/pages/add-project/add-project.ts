import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FbProvider } from '../../providers/fb/fb';
import * as firebase from 'firebase/app';



@IonicPage()
@Component({
  selector: 'page-add-project',
  templateUrl: 'add-project.html',
})
export class AddProjectPage {
  project = { title: '', summary: '', category: '', timestamp: {}, by: {uid: '', displayName: ''}, coverImage: ''}
  title: AbstractControl;
  summary: AbstractControl;
  category: AbstractControl;
  musicAlertOpts: { title: string, subTitle: string };
  authForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, private fr: FbProvider ) {
    this.authForm = this.fb.group({
      'title': [null, Validators.compose([Validators.required])],
      'summary': [null, Validators.compose([Validators.required])],
      'category': [null, Validators.compose([Validators.required])]
    });
    this.title = this.authForm.controls['title'];
    this.summary = this.authForm.controls['summary'];
    this.category = this.authForm.controls['category'];

    this.musicAlertOpts = {
      title: 'Project Category',
      subTitle: 'you can change this later'
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProjectPage');
  }

  stpSelect() {
    console.log('STP selected');
  }

  saveProject(){
    let toaster = this.toastCtrl.create({
      message: 'Error Code ',
      duration: 3000,
      position: 'bottom'
    });

    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
    loader.present();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.project.by.uid = user.uid;
        this.project.by.displayName = user.displayName;
        this.project.timestamp = firebase.database['ServerValue']['TIMESTAMP'];
        this.fr.push(`projects`, this.project).then((v) => {
          console.log('');
        }).catch(err => {
          console.log(err);
        })
        loader.dismiss();
        this.navCtrl.pop();
      }else{
        loader.dismiss();
      }
    })
  }

}
