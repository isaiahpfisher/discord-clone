import { Hash } from "lucide-react";
import { MobileToggle } from "../MobileTogle";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <div>
          <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />
        </div>
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
};
