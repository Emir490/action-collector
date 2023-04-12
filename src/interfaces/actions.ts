import { Dispatch, SetStateAction } from "react";
import { Action, Keypoints } from "./action";

export interface ActionsContextProps {
    actions: Action[];
    setActions: Dispatch<SetStateAction<Action[]>>;
    removeAction: (id: string) => Promise<void>;
    addAction: (category: string, action: string, frames: Keypoints[], file: File) => Promise<{
        error: boolean;
    } | undefined>;
}