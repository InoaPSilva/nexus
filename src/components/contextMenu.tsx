// CustomContextMenu.tsx
import { FolderPlus, Plus } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";

interface CustomContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onCreateFolder: () => void;
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
    x,
    y,
    onClose,
    onCreateFolder,
}) => {
    return ReactDOM.createPortal(
        <div
            className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
            style={{ top: y, left: x }}
            onClick={onClose}
        >
            <span className="text-xs text-muted-foreground block px-2 py-1">
                Menu de contexto
            </span>

            <div
                onClick={onCreateFolder}
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2"
            >
                <FolderPlus className="w-4 h-4" />
                <span className="text-sm">Criar pasta</span>
                <Plus className="w-3 h-3" />
            </div>
            
        </div>,
        document.body
        
    );
};

export default CustomContextMenu;
