import { Deserializable } from "../fonctional/deserializable.model"
import { Group } from "./group.model";

export class Promotion implements Deserializable {
    id: number;
    niveau: number;
    id_resp: number;
    group: Group

    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.group = new Group().deserialize(input.group)
        }
        return this
    }
}
