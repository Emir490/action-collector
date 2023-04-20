import { Action, Keypoints } from "@/interfaces/action";
import { ActionsContextProps, Video } from "@/interfaces/actions";
import axios from "axios";
import { randomUUID } from "crypto";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';

const ActionsContext = createContext<ActionsContextProps>({} as ActionsContextProps);

const ActionsProvider = ({ children }: { children: ReactNode }) => {
    const [actions, setActions] = useState<Action[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const router = useRouter();
    const action = router.query.action;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const getActions = async (action: string) => {
            try {
                const { data } = await axios(`${apiUrl}/actions/${action}`);

                setActions(data);
            } catch (error) {
                console.error(error);
            }
        }
        if (action) {
            getActions(action as string);
        }
    }, [action, apiUrl, router]);

    const addAction = async (category: string, action: string, frames: Keypoints[], file: File) => {
        try {
            const formData = new FormData();
            formData.append("category", category);
            formData.append("action", action);
            formData.append("keypoints", JSON.stringify(frames));
            formData.append("file", file);

            const { data } = await axios.post(
                `${apiUrl}/actions`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setActions(prevActions => [...prevActions, data]);
        } catch (error: any) {
            console.error("Error uploading file:", error);
            const msg = error.response.data.error ?? "Ha ocurrido un error inesperado"

            toast.error(msg);
            return {
                error: true
            }
        }
    }

    const removeAction = async (id: string) => {
        try {
            await axios.patch(`${apiUrl}/actions/${id}`);

            const updatedActions = actions.filter(actionState => actionState._id !== id);
            setActions(updatedActions);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ActionsContext.Provider value={{ videos, setVideos, actions, setActions, addAction, removeAction }}>
            {children}
        </ActionsContext.Provider>
    )
}

export { ActionsProvider }

export default ActionsContext