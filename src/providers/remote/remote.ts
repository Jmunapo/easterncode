import { Injectable } from '@angular/core';
import { FbProvider } from '../fb/fb';
import * as firebase from 'firebase/app';

@Injectable()
export class RemoteProvider {

  constructor(private rtdb: FbProvider) { }

  get_one_level(where, key) {
    return this.rtdb.object(`${where}/${key}`);
  }

  add_city(city_name: string) {
    return this.rtdb.set(`cities`, city_name, {
      name: city_name
    });
  }

  add_help_text(help_topic: string, reply) {
    return this.rtdb.set(`help`, help_topic, {
      response: reply,
    });
  }

  add_one_level(where: string, key: string, data: any) {
    return this.rtdb.set(where, key, data);
  }

  add_agent(where: string, key: string, data: any) {
    data.timestamp = firebase.database['ServerValue']['TIMESTAMP'];
    return this.rtdb.set(where, key, data);
  }

  update_one_level(where: string, key: string, data: any) {
    return this.rtdb.update(where, key, data);
  }

  remove_one_level(where: string, key: string) {
    return this.rtdb.remove(where, key);
  }

  remove_list(path_data, type) {
    let path = `cities/${path_data.city}/${path_data.location}/${type}/`;
    console.log('Remove path>>', path)
    return this.rtdb.remove(path, path_data.key);
  }

  add_list(user_data: any, data: any, type: string) {
    return this.rtdb.set(`cities/${user_data.city}/${user_data.location}/${type}`, user_data.key, data);
  }
  add_tenant(tenant: any, data: any) {
    return this.rtdb.set(`cities/${tenant.city}/${tenant.location}/waiting_list`, tenant.key, data);
  }

  transfer_to_locked(data) {
    data.timestamp = firebase.database['ServerValue']['TIMESTAMP'];
    return this.rtdb.push(`locked`, data);
  }


  get_list(data: any, type: string) {
    let path = `cities/${data.city}/${data.location}/${type}`;
    return this.rtdb.list(path)
      .map(data => data.map((item) => {
        return item;
      }));
  }

  reg_complete(key, data) {
    return this.rtdb.set(`registration/${key}`, 'loc', data);
  }
  land_reg_complete(key, data) {
    return this.rtdb.push(`registration/${key}/loc`, data);
  }

  add_payment(code: string, data: any) {
    data.timestamp = firebase.database['ServerValue']['TIMESTAMP'];
    return this.rtdb.set(`payments`, code, data);
  }

  
  get_loc_details(key: string, uni: string) {
    return this.rtdb.object(`registration/${key}/${uni}`);
  }
  set_loc_details(key: string, uni: string, lock_key: string) {
    return this.rtdb.set(`registration/${key}/`, uni, lock_key);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
