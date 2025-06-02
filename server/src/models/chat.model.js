import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chat : {
        question : {
            type: String,
            required: true,
            trim: true
        },
        answer : {
            type: String,
            required: true,
            trim: true
        }
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true
    }
}, {timestamps: true});

export const Chat = mongoose.model("Chat", chatSchema);
