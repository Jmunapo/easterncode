import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController, FabContainer } from 'ionic-angular';
import firebase from 'firebase';
import { FbProvider } from '../../providers/fb/fb';



@IonicPage()
@Component({
  selector: 'page-view-project',
  templateUrl: 'view-project.html',
})
export class ViewProjectPage {
  firedata = firebase.database().ref('/chatusers');
  user: string = '';
  project: any;
  comments = 0;
  likes = 0;
  commentsSub: any;
  user_s: boolean = false;
  teammember: boolean = false;
  projectTeam: Array<any> = [];
  clubMembers: any = [];
  me: any = {};
  member = {
    name: '',
    uid: '',
    role: ''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private fb: FbProvider, public modalCtrl: ModalController) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user.uid;
        this.me = user;
        this.project = this.navParams.get('project');
        this.user_s = (user.uid=== this.project.by.uid) ? true : false;
        this.getProjectTeam();
      }
    });
    this.getallusers().then((res: any) => {
      this.clubMembers = res;
    })
  }
  ionViewDidEnter() {
    this.getNumComments();
  }

  getNumComments(){
    this.commentsSub = this.fb.object(`counter/proj/${this.project.key}`).subscribe(val => {
      console.log(val);
      if (!isNaN(val.num)) {
        this.comments = val.num;
        this.commentsSub.unsubscribe();
      } else {
        this.comments = 0;
      }
    })
  }

  ionViewWillLeave() {
    console.log('Leaving Comments');
    //this.commentsSub.unsubscribe();
  }

  letsTalk() {
    console.log(this.project);
    let data = {
      path: `letstalkabout/projects/${this.project.key}`,
      title: this.project.title,
      by: this.project.by.uid,
      itemid: this.project.key,
    }
    this.navCtrl.push('LetstalkaboutPage', {
      data: data
    });
  }

  like(){
    console.log('I like i like');
  }

  myProjects(fab: FabContainer) {
    fab.close();
  }

  getProjectTeam(){
    let team = this.fb.get_list(`projectteam/${this.project.key}`)
      .subscribe(val => {
        if(val){
          this.projectTeam = val;
          if (this.projectTeam.findIndex(k => k.uid === this.user) > -1) {
            this.teammember = true;
          }else{
            this.teammember = false;
          }
          team.unsubscribe();
        }
      });
  }


  ionViewDidLoad() {

   }

  addTeamMember(){
    let members = this.clubMembers.filter(v => v.uid !== this.user && this.projectTeam.findIndex(k => k.uid === v.uid) === -1)
    if(members.length > 0){
      let profileModal = this.modalCtrl.create('AddPage', {
        members: members,
        projectId: this.project.key,
        projectTeam: this.projectTeam
      });
      profileModal.onDidDismiss(data => {
        if (typeof(data) === 'object'){
          this.sentNotification(data, 'add')
          this.getProjectTeam();
        } else if (data && typeof (data) !== 'object'){
          this.getProjectTeam();
        }
      });
      profileModal.present();
    }else{
      console.log('No Members Found');
    }
  }

  getNoteMessage(member, action = null) {
    let note = {
      title: '',
      body: ''
    }
    if(action === 'rm'){
      note.title = `${member.name} left ${this.project.title} project`;
      note.body = `${member.name} exited from ${this.project.title} project`;
    } else if (action === 'join') {
      note.title = `${member.name} join ${this.project.title} project`;
      note.body = `${member.name} joined the team members of ${this.project.title} project as the ${member.role}. To revoke this, delete member under your projects`;
    }else{
      if(action === 'add'){
        note.title = `You were added to ${this.project.title} Project`;
        note.body = `${this.project.by.displayName} added you to the team members of ${this.project.title} as the ${member.role}, to revoke
      this go to projects tab and press exit under your projects`;
      }else if(action === 'del'){
        note.title = `You have been removed from ${this.project.title} Project`;
        note.body = `${this.project.by.displayName} removed you from the team members of ${this.project.title}`;
      }
      
    }
    return note;
  } 
  sentNotification(member, action = null){
    let getNote = this.getNoteMessage(member, action);
    let note = {
      title: getNote.title,
      body: getNote.body,
      itemid: member.uid,
      addedon: {},
      by: {
        name: this.project.by.displayName,
        uid: this.user
      }
    }
    note.addedon = firebase.database['ServerValue']['TIMESTAMP'];
    let loader = this.loadingCtrl.create({
      content: `Notifying ${member.name}...`
    });
    loader.present();
    this.fb.push(`notifications/${member.uid}`, note)
      .then(() => {
        this.getProjectTeam();
        loader.dismiss();
      })
      .catch(err => {
        loader.dismiss();
        console.log(err);
      })
  }

  removeMember(member){
    let confirm = this.alertCtrl.create({
      message: `Are you sure you want to remove ${member.name} from ${this.project.title} project?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yah',
          handler: () => {
            let loader = this.loadingCtrl.create({
              content: `Removing ${member.name}...`
            });
            loader.present();
            this.projectTeam = this.projectTeam.filter(v => v.uid !== member.uid);
            this.fb.set(`projectteam`, this.project.key, this.projectTeam)
              .then(() => {
               this.getProjectTeam();
                this.sentNotification(member, 'del')
                loader.dismiss();
              })
              .catch(err => {
                loader.dismiss();
                console.log(err);
              })
          }
        }
      ]
    });
    confirm.present();
  }
  exit(me){
    let member = JSON.parse(JSON.stringify(me))
    member.uid = this.project.by.uid;
    let confirm = this.alertCtrl.create({
      message: `Are you sure you want to remove yourself from ${this.project.title} project team members?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yah',
          handler: () => {
            let loader = this.loadingCtrl.create({
              content: `Exiting...`
            });
            loader.present();
            this.projectTeam = this.projectTeam.filter(v => v.uid !== me.uid);
            this.fb.set(`projectteam`, this.project.key, this.projectTeam)
              .then(() => {
                this.getProjectTeam();
                this.sentNotification(member, 'rm')
                loader.dismiss();
              })
              .catch(err => {
                loader.dismiss();
                console.log(err);
              })
          }
        }
      ]
    });
    confirm.present();
  }

  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
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

  volunteer(){
    let profileModal = this.modalCtrl.create('AddPage', {
      me: this.me,
      projectId: this.project.key,
      projectTeam: this.projectTeam
    });
    profileModal.onDidDismiss(data => {
      if (typeof (data) === 'object') {
        this.getProjectTeam();
        console.log(data);
        let member = JSON.parse(JSON.stringify(data))
        member.uid = this.project.by.uid;
        this.sentNotification(member, 'join')
      } else if (data && typeof (data) !== 'object') {
        this.getProjectTeam();
      }
    });
    profileModal.present();
  }


  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
