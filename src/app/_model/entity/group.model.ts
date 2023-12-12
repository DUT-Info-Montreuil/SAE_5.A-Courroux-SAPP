import { Deserializable } from "../fonctional/deserializable.model"

export class Group implements Deserializable {
    id: string;
    name: string;
    id_group_parent: number;

    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
        }
        return this
    }
}
