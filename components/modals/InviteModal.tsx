"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [newInviteUrl, setNewInviteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      );

      setNewInviteUrl(`${origin}/invite/${response.data.inviteCode}`);

      onOpen("invite", { server: response.data });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              value={newInviteUrl ? newInviteUrl : inviteUrl}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              readOnly
              disabled={isLoading}
            />
            <Button size={"icon"} onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            className="mt-4 text-xs text-zinc-500"
            disabled={isLoading}
            onClick={onNew}
          >
            <RefreshCw className="mr-2 size-4" />
            Generate New Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
