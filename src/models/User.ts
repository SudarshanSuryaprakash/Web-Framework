import axios, {AxiosResponse} from 'axios'

interface UserProps {
  name?: string
  age?: number
  id?: number
}

type Callback = () => void 

export class User {
  events: { [key: string]: Callback[] } = {}
  constructor(private data: UserProps){}
  
  get(propName: string): number | string {
    return this.data[propName]
  }

  set(update: UserProps): void {
    Object.assign(this.data, update)
  }

  on(eventName: string, callback: Callback): void {
   const handlers = this.events[eventName] || []
    handlers.push(callback)
    this.events[eventName] = handlers
  }
  
  trigger(eventName: string): void {
    const handlers = this.events[eventName]
    handlers && handlers.length && handlers.map(callback => callback())
  }

  async fetch(): Promise<void> {
    const response: AxiosResponse = await axios.get(`http://localhost:3000/users/${this.get('id')}`)
    this.set(await response.data)
  }

  save(): void {
    if(this.get('id')) {

      axios.put(`http://localhost:3000/users/${this.get('id')}`, this.data)
    } else {
      axios.post(`http://localhost:3000/users`, this.data)
    }
  }

}
