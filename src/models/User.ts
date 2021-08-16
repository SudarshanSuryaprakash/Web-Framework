import {ApiSync} from './ApiSync'
import {Attributes} from './Attributes'
import {Eventing} from './Eventing'
import {Model} from './Model'


export interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}

const rootUrl = 'http://localhost:3000/users'

export class User extends Model<UserProps> {
  static buildUser = (attrs: UserProps): User => {
    return new User(
      new Eventing(),
      new ApiSync<UserProps>(rootUrl),
      new Attributes<UserProps>(attrs)
    )
  }
}
