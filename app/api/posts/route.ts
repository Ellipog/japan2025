import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const post = await Post.create({
      title: body.title,
      content: body.content,
      location: body.location,
      author: body.author,
      timestamp: body.timestamp || new Date(),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find({}).sort({ timestamp: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
