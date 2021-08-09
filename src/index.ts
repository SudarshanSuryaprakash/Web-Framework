import {User} from './models/User'

const user = new User({name: 'Sudo', age: 24})
user.on('change', () => console.log('change2'))
user.on('change', () => console.log('change1'))
user.on('save', () => console.log('save'))
console.log(user)
user.trigger('change')
