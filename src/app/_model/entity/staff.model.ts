import { Deserializable } from "../fonctional/deserializable.model"
import { User } from "./user.model";

export class Staff implements Deserializable {
    id: number;
    initial: string;
    user : User = new User();

    assignFromObject(obj: any): Staff {
        Object.assign(this, obj);

        if (obj.user) {
            this.user = new User().assignFromObject(obj.user);
        }

        return this;
    }
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.user = new User().deserialize(input.user)

        }
        return this
    }
}
