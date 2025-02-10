import React, { useCallback, useState } from "react";

type Mode = "list" | "map";
const MODE_LIST = ['list', 'map'];

export const useMode = () => {
    const [mode, setMode] = useState<"list" | "map">("list");

    const onModeChange = useCallback((newMode: Mode) => {
        setMode(newMode);
    }, []);

    return {
        activeMode: mode,
        modes: MODE_LIST,
        onModeChange,
    };
}