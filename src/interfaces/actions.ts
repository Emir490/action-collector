import { Dispatch, SetStateAction } from "react";
import { Action, Keypoints } from "./action";

export interface Video {
    id: number;
    video: string;
    landmarks: Keypoints[];
}

export interface ActionsContextProps {
    actions: Action[];
    videos: Video[];
    setVideos: Dispatch<SetStateAction<Video[]>>;
    addVideo: (video: string, landmarks: Keypoints[]) => void;
    setActions: Dispatch<SetStateAction<Action[]>>;
    removeAction: (id: string) => Promise<void>;
    addAction: (category: string, action: string, frames: Keypoints[], file: File) => Promise<{
        error: boolean;
    } | undefined>;
}