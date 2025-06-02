import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: function() {
            return this.chat.question.slice(0, 30) + (this.chat.question.length > 30 ? '...' : '');
        }
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
