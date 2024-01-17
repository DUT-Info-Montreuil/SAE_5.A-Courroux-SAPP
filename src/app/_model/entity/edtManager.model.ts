import { Deserializable } from "../fonctional/deserializable.model"
import { Staff } from "./staff.model";

export class EdtManager {
    id: number;
    staff: Staff;
    name: string;
    lastname: string;
    username: string;
    password?: string

    constructor(id: number, name: string, lastname: string, username: string, password: string){
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.staff = new Staff(name, lastname, username, password);
    }

    // deserialize(input: any): this {
    //     if (input) {
    //         Object.assign(this, input)
    //         this.staff = new Staff().deserialize(input.staff)
    //     }
    //     return this
    // }
}
