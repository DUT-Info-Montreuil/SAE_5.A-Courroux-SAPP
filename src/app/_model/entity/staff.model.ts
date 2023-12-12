import { Deserializable } from "../fonctional/deserializable.model"
import { User } from "./user.model";

export class Staff implements Deserializable {
    id: number;
    initial: string;
    user : User;
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.user = new User().deserialize(input.user)

        }
        return this
    }
}
