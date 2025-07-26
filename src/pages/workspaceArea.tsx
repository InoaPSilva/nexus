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
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const handleRightClick = (e: React.MouseEvent) => {
    if (workspaceRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      setContextMenu({ x: e.pageX, y: e.pageY });
    }
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const profile = useMemo(() => {
    return profiles.find((p) => p.id === currentProfile) || profiles[0];
  }, [profiles, currentProfile]);

  const windows = useMemo(() => profile?.windows || [], [profile]);
  const widgets = useMemo(() => profile?.widgets || [], [profile]);
  const folders = useMemo(() => profile?.folders || [], [profile]);

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

  const [transferItems, setTransferItems] = useState<{ windows: any[]; widgets: any[] }>();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

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
    <div className="flex-1 relative overflow-hidden h-screen" onContextMenu={handleRightClick}>
      {/* Floating Add Button */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button
          className="rounded-full w-12 h-12 shadow-lg text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => addWidget("clock", { timezone: "UTC" })}
        >
          +
        </Button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {profile?.backgroundType === "gradient" && (
          <div className={`w-full h-full bg-gradient-to-br ${profile.backgroundStyle}`} />
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

      {/* Foreground Workspace */}
      <div className="relative z-20 w-full h-full" ref={workspaceRef}>
        {/* Header */}
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

        {/* Folders */}
        {folders.map((folder: any) => (
          <DraggableWidget
            key={folder.id}
            widget={folder}
            onUpdateWidget={(id, updates) => { }} // opcional: implementar lógica para atualizar pastas
            onDeleteWidget={() => { }} // opcional: implementar lógica para deletar pasta
            onTransferWidget={() => { }} // opcional: transferir pasta
          >
            <div className="w-full h-full flex items-center justify-center text-sm">
              {folder.icon} {folder.name}
            </div>
          </DraggableWidget>
        ))}

        {/* Widgets */}
        {widgets.map((w: any) => (
          <DraggableWidget
            key={w.id}
            widget={w}
            onUpdateWidget={updateWidget}
            onDeleteWidget={deleteWidget}
            onTransferWidget={transferWidget}
          >
            <WidgetContent widget={w} />
          </DraggableWidget>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <CustomContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCreateFolder={() => setIsNewFolderOpen(true)}
        />
      )}


      <NewFolderDialog
        open={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        currentProfile={currentProfile}
        setProfiles={setProfiles}
      />

    </div>
  );
}
