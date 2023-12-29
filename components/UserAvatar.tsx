import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

export const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} className={cn("size-7 md:size-10", className)} />
    </Avatar>
  );
};
