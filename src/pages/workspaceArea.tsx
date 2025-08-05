import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import WidgetContent from "@/components/widget";
import DraggableWidget from "@/components/draggableWidget";
import CustomContextMenu from "@/components/contextMenu";
import { NewFolderDialog } from "@/components/newFolder";
import { DesktopFolderComponent } from "@/components/folder";
import { safePosition, safeSize } from "@/utils/safeFunctions";
import { DraggableWindowComponent } from "@/components/draggableWidow";
import PageContent from "@/components/page";

interface WorkspaceAreaProps {
  profiles: any[];
  setProfiles: React.Dispatch<React.SetStateAction<any[]>>;
  currentProfile: string;
  setCurrentProfile: React.Dispatch<React.SetStateAction<string>>;
}

export function WorkspaceArea({
  profiles,
  setProfiles,
  currentProfile,
}: WorkspaceAreaProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clickedItem, setClickedItem] = useState<any>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [cursor, setCursor] = useState<"default" | "grab" | "grabbing" | "crosshair">("default");
  const isPanning = useRef(false);

  const [transferItems, setTransferItems] = useState<{ windows: any[]; widgets: any[] }>();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  const profile = useMemo(() => {
    return profiles.find((p) => p.id === currentProfile) || profiles[0];
  }, [profiles, currentProfile]);

  const windows = useMemo(() => profile?.windows || [], [profile]);
  const widgets = useMemo(() => profile?.widgets || [], [profile]);
  const folders = useMemo(() => profile?.folders || [], [profile]);

  const panStart = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    setScale((prev) => Math.min(Math.max(prev - e.deltaY * zoomSpeed, 0.5), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true;
      setCursor("grabbing");
      panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    } else {
      setCursor("default");
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      setCursor("grabbing");
      setOffset({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
    } else {
      setCursor("default");
    }
  };

  const handleMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      setCursor("grab");
    }
  };

  const handleMouseLeave = () => {
    if (isPanning.current) {
      isPanning.current = false;
    }
    setCursor("default");
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (workspaceRef.current?.contains(e.target as Node)) {
      e.preventDefault();

      let foundItem = null;

      const target = e.target as HTMLElement;
      const itemId = target.closest("[data-item-id]")?.getAttribute("data-item-id");
      const itemType = target.closest("[data-item-type]")?.getAttribute("data-item-type");
      console.log(itemId);


      if (itemId && itemType) {
        if (itemType === "folder") {
          foundItem = folders.find((f: any) => f.id === itemId) || null;
          foundItem.type = itemType

        } else if (itemType === "widget") {
          foundItem = widgets.find((w: any) => w.id === itemId) || null;
        } else if (itemType === "window") {
          foundItem = windows.find((w: any) => w.id === itemId) || null;
        }
      }



      setClickedItem(foundItem);
      setContextMenu({ x: e.pageX, y: e.pageY });
    }
  };





  const openWindow = useCallback(
    (type: any["type"], title: string, content?: any) => {
      const newWindow: any = {
        id: Date.now().toString(),
        title,
        type,
        position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false,
        isSnapped: false,
        isPinned: false,
        isMiniMode: false,
        zIndex: Date.now(),
        content,
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === currentProfile ? { ...p, windows: [...p.windows, newWindow] } : p)),
      )
    },
    [windows.length, currentProfile],
  )

  const openFilePreviewWindow = useCallback(
    (file: any) => {
      const newWindow: any = {
        id: Date.now().toString(),
        title: file.name,
        type: "file-preview",
        position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
        size: { width: 600, height: 400 },
        isMinimized: false,
        isMaximized: false,
        isSnapped: false,
        isPinned: false,
        isMiniMode: false,
        zIndex: Date.now(),
        content: file,
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === currentProfile ? { ...p, windows: [...p.windows, newWindow] } : p)),
      )
    },
    [windows.length, currentProfile],
  )

  const openFolderWindow = useCallback(
    (folder: any) => {
      const existingWindow = windows.find((w: any) => w.type === "folder" && w.content?.id === folder.id)
      if (existingWindow) {
        updateWindow(existingWindow.id, { isMinimized: false, zIndex: Date.now() })
        return
      }

      const newWindow: any = {
        id: Date.now().toString(),
        title: folder.name,
        type: "folder",
        position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
        size: { width: 600, height: 400 },
        isMinimized: false,
        isMaximized: false,
        isSnapped: false,
        isPinned: false,
        isMiniMode: false,
        zIndex: Date.now(),
        content: folder,
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === currentProfile ? { ...p, windows: [...p.windows, newWindow] } : p)),
      )
    },
    [windows, currentProfile],
  )

  const updateWindow = useCallback(
    (id: string, updates: Partial<any>) => {
      // Ensure size values are valid numbers
      if (updates.size) {
        updates.size = safeSize(updates.size, 300, 200)
      }

      // Ensure position values are valid numbers
      if (updates.position) {
        updates.position = safePosition(updates.position)
      }

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === currentProfile
            ? {
              ...p,
              windows: p.windows.map((window: any) => (window.id === id ? { ...window, ...updates } : window)),
            }
            : p,
        ),
      )
    },
    [currentProfile],
  )

  const closeWindow = useCallback(
    (id: string) => {
      const window = windows.find((w: any) => w.id === id)
      if (window && window.type === "folder" && window.content?.id) {
        // Mark folder as closed
        updateFolder(window.content.id, { isOpen: false })
      }

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === currentProfile
            ? {
              ...p,
              windows: p.windows.filter((window: any) => window.id !== id),
            }
            : p,
        ),
      )
    },
    [windows, currentProfile],
  )


  const updateFolder = useCallback(
    (id: string, updates: Partial<any>) => {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === currentProfile
            ? {
              ...p,
              folders: p.folders.map((folder: any) => (folder.id === id ? { ...folder, ...updates } : folder)),
            }
            : p,
        ),
      )
    },
    [currentProfile],
  )
  const dropInWindow = useCallback((windowId: string, item: any, itemType: string) => {

    console.log("Dropped", itemType, "into window", windowId)
  }, [])

  const deleteFolder = useCallback(
    (id: string) => {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === currentProfile
            ? {
              ...p,
              folders: p.folders.filter((folder: any) => folder.id !== id),
            }
            : p,
        ),
      )
    },
    [currentProfile],
  )

  const dropInFolder = useCallback(
    (folderId: string, item: any, itemType: string) => {
      if (itemType === "widget") {
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === currentProfile
              ? {
                ...p,
                widgets: p.widgets.filter((w: any) => w.id !== item.id),
                folders: p.folders.map((folder: any) =>
                  folder.id === folderId
                    ? { ...folder, items: [...folder.items, { ...item, parentFolderId: folderId }] }
                    : folder,
                ),
              }
              : p,
          ),
        )
      }
    },
    [currentProfile],
  )

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);


  const createNewWidgetId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

  const generateWidgetPosition = () => ({
    x: Math.random() * 200 + 100,
    y: Math.random() * 200 + 100,
  });

  const addWidget = useCallback(
    (type: string, content: any) => {
      const newWidget = {
        id: createNewWidgetId(),
        type,
        position: generateWidgetPosition(),
        size:
          type === "statistics"
            ? { width: 280, height: 220 }
            : type === "clock"
              ? { width: 200, height: 120 }
              : type === "weather"
                ? { width: 250, height: 180 }
                : type === "file-preview"
                  ? { width: 300, height: 250 }
                  : { width: 250, height: 200 },
        content,
        zIndex: Date.now(),
      };

      setProfiles((all) =>
        all.map((p) =>
          p.id === currentProfile
            ? { ...p, widgets: [...p.widgets, newWidget] }
            : p
        )
      );
    },
    [currentProfile, setProfiles]
  );

  const updateWidget = useCallback(
    (id: string, updates: Partial<any>) => {
      setProfiles((all) =>
        all.map((p) =>
          p.id === currentProfile
            ? {
              ...p,
              widgets: p.widgets.map((w: any) =>
                w.id === id ? { ...w, ...updates } : w
              ),
            }
            : p
        )
      );
    },
    [currentProfile, setProfiles]
  );

  const deleteWidget = useCallback(
    (id: string) => {
      setProfiles((all) =>
        all.map((p) =>
          p.id === currentProfile
            ? { ...p, widgets: p.widgets.filter((w: any) => w.id !== id) }
            : p
        )
      );
    },
    [currentProfile, setProfiles]
  );

  const transferWidget = useCallback((w: any) => {
    setTransferItems({ windows: [], widgets: [w] });
    setIsTransferDialogOpen(true);
  }, []);

  useEffect(() => {
    if (transferItems?.widgets?.length) {
      setProfiles((all) =>
        all.map((p) =>
          p.id === currentProfile
            ? {
              ...p,
              widgets: [
                ...p.widgets,
                ...transferItems.widgets.map((w) => ({
                  ...w,
                  id: createNewWidgetId(),
                  zIndex: Date.now(),
                  position: w.position || generateWidgetPosition(),
                })),
              ],
            }
            : p
        )
      );
      setTransferItems(undefined);
    }
  }, [transferItems, currentProfile, setProfiles]);

  return (
    <div
      className="flex-1 relative overflow-hidden h-screen"
      onContextMenu={handleRightClick}
    >

      {/* Context Menu */}
      {
        contextMenu && (
          <CustomContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            deleteFolder={deleteFolder}
            createWidget={addWidget}
            createWindow={openWindow}
            onClose={() => setContextMenu(null)}
            onCreateFolder={() => setIsNewFolderOpen(true)}
            clickedSomething={clickedItem}
          />
        )
      }

      <NewFolderDialog
        open={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        currentProfile={currentProfile}
        setProfiles={setProfiles}
      />

      <div className="absolute inset-0 z-0">
        {profile?.backgroundType === "gradient" && (
          <div
            className={`w-full h-full bg-gradient-to-br ${profile.backgroundStyle}`}
          />
        )}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      <div className="relative z-20 w-full h-full" ref={workspaceRef}>
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">{profile?.icon}</span>
              <div>
                <h3 className="font-medium text-sm">{profile?.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {profile?.description}
                </p>
              </div>
            </div>
          </div>
          {(windows.length || widgets.length) > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm"
              onClick={() => setTransferItems({ windows, widgets })}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Transfer All
            </Button>
          )}
        </div>

        <div
          className="relative w-full h-full overflow-hidden"
          style={{ cursor }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "0 0",
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {folders.map((folder: any) => (
              <DesktopFolderComponent
                folder={folder}
                data-item-id={folder.id}
                data-item-type="folder"
                onUpdateFolder={updateFolder}
                onDropInFolder={dropInFolder}
                onOpenFolder={openFolderWindow}
              >
              </DesktopFolderComponent>
            ))}
            {windows.map((window: any) => (
              <DraggableWindowComponent
                key={window.id}
                window={window}
                data-item-id={window.id}
                data-item-type="window"
                onUpdateWindow={updateWindow}
                onCloseWindow={closeWindow}
                onDropInWindow={dropInWindow}
              >
                <PageContent
                  window={window}
                  openFilePreviewWindow={openFilePreviewWindow}
                />
              </DraggableWindowComponent>
            ))}

            {widgets.map((w: any) => (
              <DraggableWidget
                key={w.id}
                widget={w}
                data-item-id={w.id}
                data-item-type="widget"
                onUpdateWidget={updateWidget}
                onDeleteWidget={deleteWidget}
                onTransferWidget={transferWidget}
                onDropInWidget={dropInWindow}

              >
                <WidgetContent widget={w} />
              </DraggableWidget>
            ))}
          </div>


        </div>
      </div>


    </div >
  );
}
