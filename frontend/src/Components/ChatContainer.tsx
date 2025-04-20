"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useEffect } from "react";
import { getMessages } from "@/lib/reducer/userChatSlice";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Image from "next/image";
import { formatMessageTime } from "@/lib/utils";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useAppSelector(
    (state) => state.chat
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      await dispatch(getMessages(selectedUser?._id as string));
    };
    fetchMessages();
  }, [dispatch, selectedUser?._id]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto mx-1">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.senderId === user?._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <Image
                  src={
                    message.senderId === user?._id
                      ? user?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  height={48}
                  width={48}
                  className="size-10 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time>{formatMessageTime(message.createdAt)}</time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === user?._id
                  ? "bg-primary text-primary-content"
                  : "bg-base-200"
              }`}
            >
              {message.image && (
                <Image
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 object-contain size-auto"
                  width={400}
                  height={400}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
