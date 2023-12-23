import { Deserializable } from "../fonctional/deserializable.model"

export class WeekComment implements Deserializable {
    id: number;
    year: string;
    content: number;
    week_number: number;

    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
        }
        return this
    }
}
