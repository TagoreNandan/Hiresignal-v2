import mongoose, {Schema, model, Document} from 'mongoose';

//interface defines Typescript type for Note document

interface INote extends Document {
    applicationId: number;
    companyName: string;
    researchNotes: string;
    techStack: string;
    culture: string;
    salaryInfo: string;
    interviewPrep: string;
    contacts: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}


//Schema desfines the MongoDB doc structure

//App ID in both links to PostgreSQL application, so we can easily query notes for a specific application

const NoteSchema: Schema = new Schema<INote>({
    applicationId: { type: Number, required: true },
    companyName: { type: String, required: true },
    researchNotes: String,
    techStack: String,
    culture: String,
    salaryInfo: String,
    interviewPrep: String,
    contacts: String,
    tags: String,
}, {
    timestamps: true 
}
);

//Timestamp - auto adds createdAt and updatedAt fields
//model() - compiles the schema into a model, which becomes model notes

export const Note = model<INote>('Note', NoteSchema);

//entire code defines Mongoose schema and model for Note, which is associated with a job application and contains various fields for notes and tags.


