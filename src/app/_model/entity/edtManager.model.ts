import { Deserializable } from "../fonctional/deserializable.model"
import { Staff } from "./staff.model";

export class EdtManager implements Deserializable {
    id: string;
    staff: Staff;

    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.staff = new Staff().deserialize(input.staff)
        }
        return this
    }
}
