import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadTutorialPage } from './read-tutorial';

@NgModule({
  declarations: [
    ReadTutorialPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadTutorialPage),
  ],
})
export class ReadTutorialPageModule {}
