"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../UserAvatar";
import { ActionTooltip } from "../ActionTooltip";
import { Edit, File, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState();

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: content },
  });

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-sm font-semibold hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                <p>{roleIconMap[member.role]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square size-48 items-center overflow-auto rounded-md border bg-secondary"
            >
              <Image
                fill
                src={fileUrl}
                alt={content}
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <File className="size-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "mt-1 text-xs italic text-zinc-500 dark:text-zinc-400",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            placeholder="Edited your message..."
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size={"sm"} variant={"primary"} disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press escape{" "}
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium text-muted-foreground">
                  ⎋
                </kbd>{" "}
                to cancel, enter{" "}
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium text-muted-foreground">
                  ⏎
                </kbd>{" "}
                to save.
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="ml-auto size-4 cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash className="ml-auto size-4 cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
