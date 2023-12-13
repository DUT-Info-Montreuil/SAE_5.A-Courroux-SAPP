import { Deserializable } from "../fonctional/deserializable.model"
import { User } from "./user.model";

export class Staff {
    id: number;
    initial: string;
    user : User;
    
    constructor(name: string, lastname: string, username: string, password: string){
        this.user = new User(name, lastname, username, password);
    }

    // deserialize(input: any): this {
    //     if (input) {
    //         Object.assign(this, input)
    //         this.user = new User().deserialize(input.user)

    //     }
    //     return this
    // }
}
