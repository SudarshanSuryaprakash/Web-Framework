import { AxiosPromise } from "axios";

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface ModelAttributes<T> {
  set(update: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface HasId {
  id?: number
}


export class Model<T extends HasId> {
  constructor(private events: Events, private sync: Sync<T>, private attributes: ModelAttributes<T>){}

  // get on() {
  //   return this.events.on;
  // }

  // get trigger() {
  //   return this.events.trigger;
  // }

  // get get() {
  //   return this.attributes.get;
  // }
  on = this.events.on
  get = this.attributes.get
  trigger = this.events.trigger

  set = (update: T): void => {
    this.attributes.set(update);
    this.events.trigger("change");
  };

  fetch = async (): Promise<void> => {
    const id = this.get("id");
    if (typeof id !== "number") {
      throw new Error("Need an Id. Cannot fetch");
    }
    const response = await this.sync.fetch(id);
    this.set(response.data);
  };

  save = async (): Promise<void> => {
    try {
    const response = await this.sync.save(this.attributes.getAll());
    this.trigger('save')
    } catch {
      this.trigger('error')
    }
  };
}

