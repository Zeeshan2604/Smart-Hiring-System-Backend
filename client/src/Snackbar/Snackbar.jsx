import React, { createContext, useContext, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from 'framer-motion';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [snackbarType, setSnackbarType] = useState("info");

    const showSnackbar = (message, type = "info") => {
        setSnackbarMsg(message);
        setSnackbarType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Color mapping for dark/light mode
    const getBgColor = () => {
        if (snackbarType === "success") return "bg-green-600 dark:bg-green-500";
        if (snackbarType === "error") return "bg-red-600 dark:bg-red-500";
        if (snackbarType === "info") return "bg-blue-600 dark:bg-blue-500";
        return "bg-gray-800 dark:bg-gray-700";
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed bottom-6 left-6 z-50 min-w-[280px] max-w-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${getBgColor()} text-white dark:text-gray-100 font-semibold`}
                        role="alert"
                        aria-live="assertive"
                    >
                        <span className="flex-1">{snackbarMsg}</span>
                        <button onClick={handleClose} className="ml-2 p-1 rounded hover:bg-white/10 focus:outline-none">
                            <RxCross2 size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    return useContext(SnackbarContext);
}