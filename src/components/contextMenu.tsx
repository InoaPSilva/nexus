// CustomContextMenu.tsx
import { ArrowRight, BookPlus, FilePlus, FolderPlus, Minus, Plus, Trash, Webhook } from "lucide-react";
import React, { useState } from "react";
import ReactDOM from "react-dom";

interface CustomContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onCreateFolder: () => void;
    createWidget?: (type: string, content: any) => void;
    createWindow?: (type: any["type"], title: string, content?: any) => void;
    deleteFolder?: (id: any) => void;
    clickedSomething?: any
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
    x,
    y,
    onClose,
    onCreateFolder,
    createWidget,
    createWindow,
    clickedSomething,
    deleteFolder

}) => {

    const [isGetDataFromSource, setIsGetDataFromSource] = useState(false);
    const [isGetDataFromWidget, setIsGetDataFromWidget] = useState(false);
    const [isGetDataFromWindow, setIsGetDataFromWindow] = useState(false);

    const currentSources = ["Source 1", "Source 2", "Source 3"];
    const widgetList = ["clock", "calculator", "bookmark",
        // "file"
    ];
    const windowList = ["gallery", "notes", "task", "empty"]

    const selectFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsGetDataFromSource(true);
    };
    const selectWidget = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsGetDataFromWidget(true);
    };
    const selectWindow = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsGetDataFromWindow(true);
    };


    return ReactDOM.createPortal(
        <>
            {/* Main menu */}
            {!clickedSomething && (
                <>
                    <div
                        className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                        style={{ top: y, left: x }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        <span className="text-xs text-muted-foreground block px-2 py-1">
                            Menu de contexto
                        </span>

                        {/* Create folder */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onCreateFolder();
                                onClose();
                            }}
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2"
                        >
                            <FolderPlus className="w-4 h-4" />
                            <span className="text-sm">Criar pasta</span>
                            <Plus className="w-3 h-3" />
                        </div>

                        <div
                            onClick={selectWidget}
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2 relative"
                        >
                            <BookPlus className="w-4 h-4" />
                            <span className="text-sm">Criar widget</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>

                        <div
                            onClick={selectWindow}
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2 relative"
                        >
                            <FilePlus className="w-4 h-4" />
                            <span className="text-sm">Criar página</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>

                        <div
                            onClick={selectFolder}
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2 relative"
                        >
                            <Webhook className="w-4 h-4" />
                            <span className="text-sm">Obter dado de fonte</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>

                    {/* Submenu */}
                    {isGetDataFromSource && (
                        <div
                            className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                            style={{
                                top: y,
                                left: x + 260,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs text-muted-foreground block px-2 py-1">
                                Selecione uma fonte
                            </span>
                            <div>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {currentSources.map((source, index) => (
                                        <li onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                createWidget?.("source", { source });
                                                setIsGetDataFromSource(false);
                                                onClose();
                                            }
                                        } key={index} className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                                            {source}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {isGetDataFromWidget && (
                        <div
                            className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                            style={{
                                top: y,
                                left: x + 260,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs text-muted-foreground block px-2 py-1">
                                Selecione um tipo de widget
                            </span>
                            <div>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {widgetList.map((widget, index) => (
                                        <li onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                createWidget?.(widget, { widget });
                                                setIsGetDataFromWidget(false);
                                                onClose();
                                            }
                                        } key={index} className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                                            {widget}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {isGetDataFromWindow && (
                        <div
                            className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                            style={{
                                top: y,
                                left: x + 260,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs text-muted-foreground block px-2 py-1">
                                Selecione um tipo de página
                            </span>
                            <div>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {windowList.map((window, index) => (
                                        <li onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                createWindow?.(window, window, window);
                                                setIsGetDataFromWindow(false);
                                                onClose();
                                            }
                                        } key={index} className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                                            {window}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}


            {/* Contextual menu */}
            {clickedSomething?.type === "folder" && (
                <div
                    className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                    style={{ top: y, left: x }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <span className="text-xs text-muted-foreground block px-2 py-1">
                        Editar {clickedSomething.name}
                    </span>

                    {/* Create folder */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            clickedSomething?.delete;
                            onClose();
                        }}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2"
                    >
                        <Trash className="w-4 h-4" />
                        <span className="text-sm">Remover</span>
                        <Minus className="w-3 h-3" />
                    </div>
                </div>
            )}
            {clickedSomething?.type === "widget" && (
                <div
                    className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                    style={{ top: y, left: x }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <span className="text-xs text-muted-foreground block px-2 py-1">
                        Editar {clickedSomething.name}
                    </span>

                    {/* Create folder */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            // clickedSomething?.delete;
                            console.log(clickedSomething);
                            
                            if (clickedSomething.itemId) {
                                deleteFolder?.(clickedSomething.itemId);
                            }
                            onClose();
                        }}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2"
                    >
                        <Trash className="w-4 h-4" />
                        <span className="text-sm">Remover</span>
                        <Minus className="w-3 h-3" />
                    </div>
                </div >
            )
            }
            {
                clickedSomething?.type === "folder" && (
                    <div
                        className="absolute z-50 w-64 bg-white p-2 rounded shadow-lg"
                        style={{ top: y, left: x }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        <span className="text-xs text-muted-foreground block px-2 py-1">
                            Editar {clickedSomething.name}
                        </span>

                        {/* Create folder */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                clickedSomething?.delete;
                                onClose();
                            }}
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center justify-between gap-2"
                        >
                            <Trash className="w-4 h-4" />
                            <span className="text-sm">Remover</span>
                            <Minus className="w-3 h-3" />
                        </div>
                    </div>
                )
            }


        </>,
        document.body
    );
};

export default CustomContextMenu;
