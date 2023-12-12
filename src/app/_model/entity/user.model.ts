import { Deserializable } from "../fonctional/deserializable.model"

export class User implements Deserializable {
    id: number;
    username: string;
    password?: string
    role: string;
    name: string;
    lastname: string;

    assignFromObject(obj: any): User {
        return Object.assign(this, obj);
    }
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
        }
        return this
    }
}
