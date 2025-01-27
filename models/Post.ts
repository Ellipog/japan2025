import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: Array<{
    type: string;
    content: string;
  }>;
  author: string;
  timestamp: Date;
  location: string;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  content: [
    {
      type: {
        type: String,
        required: true,
        enum: ["text", "image", "code"], // Add more types as needed
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  author: {
    type: String,
    required: [true, "Please provide an author name"],
  },
  timestamp: {
    type: Date,
    required: [true, "Please provide a timestamp"],
  },
  location: {
    type: String,
    required: [true, "Please provide a location"],
  },
});

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
