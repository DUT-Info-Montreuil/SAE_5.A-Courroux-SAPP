import { Deserializable } from "../fonctional/deserializable.model"
import { Staff } from "./staff.model";

export class Teacher implements Deserializable {
    id: number;
    name: string;
    lastname: string;
    staff: Staff = new Staff();

    assignFromObject(obj: any): void {
        Object.assign(this, obj);

        if (obj.staff) {
            this.staff = new Staff().assignFromObject(obj.staff);
        }
    }
    
    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
            this.staff = new Staff().deserialize(input.staff)
        }
        return this
    }
}
