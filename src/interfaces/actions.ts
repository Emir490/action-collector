import { Dispatch, SetStateAction } from "react";
import { Action, Keypoints } from "./action";

export interface Video {
    id: number;
    category: string;
    action: string;
    video: string;
    landmarks: Keypoints[];
}

export interface ActionsContextProps {
    actions: Action[];
    videos: Video[];
    setVideos: Dispatch<SetStateAction<Video[]>>;
    setActions: Dispatch<SetStateAction<Action[]>>;
    removeAction: (id: string) => Promise<void>;
    addAction: (category: string, action: string, frames: Keypoints[], file: File) => Promise<{
        error: boolean;
    } | undefined>;
}