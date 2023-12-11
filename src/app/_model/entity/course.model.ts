import { Deserializable } from "../fonctional/deserializable.model"

export class Course implements Deserializable {
    id: string;
    start_time: Date;
    end_time: Date;
    id_enseignant: number;
    initial_resource: string;
    id_group: number;
    name_salle: string;
    appelEffectue: boolean;
    is_published: boolean;

    deserialize(input: any): this {
        if (input) {
            Object.assign(this, input)
        }
        return this
    }
}
