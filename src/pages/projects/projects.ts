import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, FabContainer } from 'ionic-angular';
import { FbProvider } from '../../providers/fb/fb';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
  pagetitle = 'All Projects'
  user: string = '';
  filtered: boolean = false;
  allProjects: Array<any> = [];
  projects: any;
  showSearch: boolean = false;
  notready: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, private fr: FbProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user.uid;
      }});

  }

  ionViewWillLoad() {
    this.fr.get_list('projects/')
      .subscribe(v => {
        this.allProjects = v;
        this.initializeProjects();
        this.notready = false;
      })
  }
  initializeProjects(){
    this.projects = this.allProjects.reverse();
  }

  addProject(){
    this.navCtrl.push('AddProjectPage')
  }

  myProjects(fab: FabContainer){
    this.filtered = true;
      fab.close();
    this.pagetitle = 'My Projects'
    this.projects = this.allProjects.filter((project) => {
      return project.by.uid === this.user;
    });
  }
  viewAllProjects(){
    this.projects = this.allProjects;
    this.filtered = false;
    this.pagetitle = 'All Projects';
  }

  getItems(ev) {
    this.initializeProjects();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.projects = this.allProjects.filter((project) => {
        let name = project.by.displayName.toLowerCase();
        let title = project.title.toLowerCase();
        let cat = project.category.join(" ");
        let v = val.toLowerCase();
        if (name.indexOf(v) > -1 || title.indexOf(v) > -1 || cat.toLowerCase().indexOf(v) > -1){
          return true;
        }
        return false;
      })
    }
  }
  toggleSearch(){
    this.showSearch = !this.showSearch;
  }
  viewProject(project){
    console.log(project);
    this.navCtrl.push('ViewProjectPage', {
      project: project
    })
  }
}
