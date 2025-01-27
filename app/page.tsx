"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, LetterText, MapPin } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  content: Array<{ type: string; content: string }>;
  author: string;
  timestamp: string;
  location?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/posts", {
        title,
        content: [{ type: "text", content }],
        author,
        location,
        timestamp: new Date(),
      });
      setTitle("");
      setContent("");
      setAuthor("");
      setLocation("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get readable location name
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const locationName = response.data.display_name;
          setLocation(locationName);
        } catch (error) {
          console.error("Error getting location name:", error);
          setLocation(
            `${position.coords.latitude}, ${position.coords.longitude}`
          );
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={getGPSLocation}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            📍 Get Location
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="pl-8 ml-7 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
            <div className="flex justify-start items-baseline -ml-6">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <div className="text-md text-gray-400 ml-2">{post.author}</div>
            </div>
            <p className="text-gray-700 mb-2 -ml-6">
              <LetterText className="absolute mt-[0.3rem] -left-6 w-4 h-4 text-gray-400 transform" />
              {post.content[0].content}
            </p>
            <MapPin className="absolute mt-[0.3rem] -left-6 w-4 h-4 text-gray-400 transform" />
            <span className="text-sm text-gray-500 pt-0.5 -ml-6">
              {post.location}
            </span>
            <Clock className="absolute mt-[0.1rem] -left-6 w-4 h-4 text-gray-400 transform" />
            <span className="text-sm text-gray-500 mb-2 flex -ml-6">
              {new Date(post.timestamp).toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
