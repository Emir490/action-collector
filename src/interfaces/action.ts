export interface Action {
    _id: string;
    category: string;
    sequence: string;
    video: string;
}

export interface Keypoints {
    pose: number[];
    face: number[];
    leftHand: number[];
    rightHand: number[];
}