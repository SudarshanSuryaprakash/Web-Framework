import { User } from "./models/User";

const user = new User({ id: 1 });

user.set({name: 'Sudarshan', age: 24})
user.save()

