import { Deserializable } from "../fonctional/deserializable.model"

export class Teacher implements Deserializable {
    id: number;
    name: string;
    lastname: string;
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
        }
        return this
    }
}
