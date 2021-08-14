import { Eventing } from "./Eventing";
import { Sync } from "./Sync";
import { Attributes } from "./Attributes";

export interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}

export class User {
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>(
    "http://localhost:3000/users"
  );
  public attributes: Attributes<UserProps>;

  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs);
  }

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set = (update: UserProps): void => {
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
