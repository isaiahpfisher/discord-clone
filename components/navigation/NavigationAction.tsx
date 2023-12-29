"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../ActionTooltip";
import { useModal } from "@/hooks/useModalStore";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="add a server">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
