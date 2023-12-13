import { Deserializable } from "../fonctional/deserializable.model"
import { Staff } from "./staff.model";

export class Teacher implements Deserializable {
    id: number;
    staff: Staff;
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.staff = new Staff().deserialize(input.staff)

        }
        return this
    }
}