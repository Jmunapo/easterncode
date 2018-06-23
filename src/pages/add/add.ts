import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FbProvider } from '../../providers/fb/fb';
import * as firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
  members: any;
  projectId: string = '';
  projectTeam: any = [];
  me: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl: ViewController, private fb: FbProvider,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) { 
      this.members = this.navParams.get('members');
      this.projectId = this.navParams.get('projectId');
      this.projectTeam = this.navParams.get('projectTeam');
      if (!this.members){
        this.me = this.navParams.get('me');
        this.selectUser(this.me);
        console.log(this.me);
      }
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

  selectUser(user){
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Role');

    alert.addInput({
      type: 'radio',
      label: 'Developer',
      value: 'Developer',
      checked: true
    });
    
    alert.addInput({
      type: 'radio',
      label: 'Analyst',
      value: 'Analyst'
    });

    alert.addInput({
      type: 'radio',
      label: 'Hacker',
      value: 'Hacker'
    });

    alert.addInput({
      type: 'radio',
      label: 'Tester',
      value: 'Tester'
    });

    alert.addInput({
      type: 'radio',
      label: 'Project Manager',
      value: 'Project Manager'
    });

    alert.addInput({
      type: 'radio',
      label: 'Product Manager',
      value: 'Product Manager'
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
        let membership = {
          name: user.displayName,
          uid: user.uid,
          role: data
        }
        if(data === 'other'){
          this.enterRole(membership)
        }else{
          this.saveClose(membership)
        }
      }
    });
    alert.present();
  }

  saveClose(data){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    data.timestamp = firebase.database['ServerValue']['TIMESTAMP'];
    this.projectTeam.push(data)
    this.fb.set(`projectteam`, this.projectId, this.projectTeam)
      .then(() => {
        loader.dismiss();
        this.viewCtrl.dismiss(data);
      })
      .catch(err => {
        loader.dismiss();
        this.viewCtrl.dismiss(false);
        console.log(err);
      })
  }
  enterRole(data){
    let prompt = this.alertCtrl.create({
      message: `${data.name}'s Role`,
      inputs: [
        {
          name: 'role',
          placeholder: `Enter ${data.name}'s role`
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: role => {
            this.viewCtrl.dismiss(false);
          }
        },
        {
          text: 'Save',
          handler: role => {
            if(role.role !== ''){
              data.role = role.role;
              this.saveClose(data);
            }else{
              this.enterRole(data)
            }
          }
        }
      ]
    });
    prompt.present();
  }
  close(){
    this.viewCtrl.dismiss(false);
  }
}
