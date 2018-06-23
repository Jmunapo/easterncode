import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class DbProvider {

  constructor(private storage: Storage) {
    console.log('Hello DbProvider Provider');
    
  }

  setData(key, value) {
    return this.storage.set(key, value).then(res => {
      if (res) {
        return true;
      } else {
        return false;
      }
    });
  }
  getData(key) {
    return this.storage.get(key).then(value => {
      if (value) {
        return value;
      } else {
        return false;
      }
    });
  }

  removeData(key) {
    return this.storage.remove(key).then(value => {
      if (value) { return value } else { return false }
    });
  }

  getConfig(page){

  }

  removeConfig(page){

  }

}
