import { Deserializable } from "../fonctional/deserializable.model"

export class Resource implements Deserializable {
    initial: string;
    name: string;
    id_promo: number
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
        }
        return this
    }
}
