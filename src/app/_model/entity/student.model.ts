import { Deserializable } from "../fonctional/deserializable.model"
import { User } from "./user.model";

export class Student implements Deserializable {
    id: number;
    user : User;
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.user = new User().deserialize(input.user)

        }
        return this
    }
}
