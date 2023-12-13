import { Deserializable } from "../fonctional/deserializable.model"

export class User {
    id: number;
    username: string;
    password?: string
    role: string;
    name: string;
    lastname: string;

    constructor(name: string, lastname: string, username: string, password: string){
        this.name = name;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
    }
    
    // deserialize(input: any): this {
    //     if (input) {
    //         Object.assign(this, input)
    //     }
    //     return this
    // }
}
