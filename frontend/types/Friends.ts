import { ReactNode } from "react";

export interface FriendRequest {
  id: string;
  email: string;
};

export interface Friend {
  id: string;
  email: string;
};

export interface FriendsBoxProps {
  title: string;
  children: ReactNode;
  className?: string;
  height?: string
};

export interface FindFriendsProps {
  email: string;
  setEmail: React.Dispatch<string>;
  onClick: () => void;
};
