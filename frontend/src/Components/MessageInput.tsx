"use client";

import { useAppDispatch } from "@/lib/hooks";
import { sendMessage } from "@/lib/reducer/userChatSlice";
import { X, Image as ImageIcon, Send } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files ? e.target.files[0] : null;
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const formData = new FormData();
      const file = fileRef.current?.files ? fileRef.current.files[0] : null;
      if (file) {
        formData.append("image", file);
      }
      formData.append("text", text);
      await dispatch(sendMessage(formData));
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    } finally {
      setText("");
      setImagePreview(null);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <Image
              src={imagePreview}
              alt="preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
              height={80}
              width={80}
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center hover:cursor-pointer"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="w-full h-auto input input-bordered rounded-lg input-sm sm:input-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileRef}
            className="hidden"
          />
          <button
            type="button"
            className={`flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <ImageIcon size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
