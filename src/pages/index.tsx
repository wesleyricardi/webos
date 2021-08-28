import { useState } from "react";
import style from "../styles/sow/index.module.css";
import Apps from "../components/sow/apps";
import Window from "../components/sow/window";
import Taskbar from "../components/sow/taskbar";
import Nav from "../components/sow/nav";
import Search from "../components/sow/search";
import Desktop from "../components/sow/desktop";
import Head from "next/head";
import makeID from "../components/_extra/makeID";

type OpenApps = {
  id: string;
  name: string;
  component: JSX.Element;
  icon: string;
  windowStyle: string;
  windowID: string;
};

interface ResizeWindow {
  element: HTMLElement;
  origem: string;
  coordinates: {
    x: number;
    y: number;
  };
}

interface ResizeY extends ResizeWindow {
  h: number;
  y: number;
}

interface ResizeX extends ResizeWindow {
  w: number;
  x: number;
}

type MoveWindow = {
  element: HTMLElement;
  x: number;
  y: number;
};

export default function FloatWindow() {
  const [MenuStartopen, setMenuStartopen] = useState<boolean>(false);
  const [WindowSearchOpen, setWindowSearchOpen] = useState<boolean>(false);
  const [openWindows, setOpenWindows] = useState<OpenApps[]>([]);
  let toResize: ResizeX | ResizeY | null;
  let toMove: MoveWindow | null;

  function OpenApp(app: string): void {
    Apps.map((App) => {
      if (App.id === app) {
        if (!App.windowID) {
          const newOpenApp = {
            id: app,
            name: App.name,
            component: App.component,
            windowStyle: App.windowStyle,
            windowID: makeID(5),
            icon: App.icon,
          };

          setOpenWindows([...openWindows, newOpenApp]);
        } else {
          const itsReadyOpen = openWindows.some(
            (openWindow) => openWindow.windowID === App.windowID
          );
          if (!itsReadyOpen) setOpenWindows([...openWindows, App]);
          else alert("App já aberto");
        }
      }
    });
  }

  function closeWindow(id: string): void {
    const newOpenWindows = openWindows.filter((app) => {
      if (app.windowID !== id) return app;
    });
    setOpenWindows(newOpenWindows);
  }

  function select(e: any): void {
    if (e.currentTarget === e.target) {
      const rect = e.currentTarget.getBoundingClientRect();
      const coordinates = { x: e.clientX, y: e.clientY };
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const h = e.currentTarget.offsetHeight;
      const w = e.currentTarget.offsetWidth;

      if (x <= 3) {
        toResize = {
          element: e.currentTarget,
          w,
          origem: "left",
          x,
          coordinates,
        };
      }

      if (x >= w - 3) {
        toResize = {
          element: e.currentTarget,
          w,
          origem: "right",
          x,
          coordinates,
        };
      }

      if (y <= 3) {
        toResize = {
          element: e.currentTarget,
          h,
          origem: "top",
          y,
          coordinates,
        };
      }

      if (y >= h - 3) {
        toResize = {
          element: e.currentTarget,
          h,
          origem: "bottom",
          y,
          coordinates,
        };
      }

      if (x > 3 && y > 3 && x < w - 3 && y < h - 3 && y < 30)
        toMove = { element: e.currentTarget, x, y };
    }
  }

  function unselect(): void {
    toMove = null;
    toResize = null;
  }

  function onMove(e: any) {
    const x = e.clientX;
    const y = e.clientY;
    //console.log(x);
    if (toMove) {
      toMove.element.style.top = `${y - toMove.y}px`;
      toMove.element.style.left = `${x - toMove.x}px`;

      if (toMove.element.style.minWidth == "100vw") {
        const ElementFullSizeX = toMove.element.offsetWidth;

        toMove.element.style.minWidth = "";
        toMove.element.style.minHeight = "";
        toMove.element.style.transform = "";
        toMove.element.style.padding = "";
        toMove.element.style.boxShadow = "";

        (
          document.getElementById(
            "fullWindowHandle_" + toMove.element.id
          ) as HTMLElement
        ).innerHTML = "□";

        const ElementWinSizeX = parseInt(
          toMove.element.style.width.slice(0, -2)
        );

        const NewX = (ElementWinSizeX * x) / ElementFullSizeX;
        toMove = {
          element: toMove.element,
          x: NewX,
          y,
        };
      }
    }

    if (toResize && toResize.element.style.minWidth !== "100vw") {
      if (toResize.origem === "left") {
        if (toResize.coordinates.x - x + toResize.w >= 200) {
          toResize.element.style.left = x - toResize.x + "px";
          toResize.element.style.width =
            toResize.coordinates.x - x + toResize.w + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "w-resize";
        }
      }

      if (toResize.origem === "top") {
        if (toResize.coordinates.y - y + toResize.h >= 100) {
          toResize.element.style.top = y - toResize.y + "px";
          toResize.element.style.height =
            toResize.coordinates.y - y + toResize.h + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "n-resize";
        }
      }

      if (toResize.origem === "right") {
        if (x - toResize.coordinates.x + toResize.w > 200) {
          toResize.element.style.width =
            x - toResize.coordinates.x + toResize.w + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "w-resize";
        }
      }

      if (toResize.origem === "bottom") {
        if (y - toResize.coordinates.y + toResize.h > 100) {
          toResize.element.style.height =
            y - toResize.coordinates.y + toResize.h + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "n-resize";
        }
      }
    }
  }

  function closeTaskbarsWindows(): void {
    setWindowSearchOpen(false);
    setMenuStartopen(false);
  }

  return (
    <>
      <Head>
        <title>WOS - Web Operational System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        onClick={unselect}
        onMouseDown={() => {
          if (MenuStartopen) setMenuStartopen(false);
          if (WindowSearchOpen) setWindowSearchOpen(false);
        }}
        onMouseLeave={unselect}
        onMouseMove={onMove}
        className={style.window_container}
        id="main"
      >
        <Desktop OpenApp={OpenApp} />

        {openWindows && (
          <>
            {openWindows.map((app) => (
              <Window
                select={select}
                unselect={unselect}
                closeWindow={closeWindow}
                app={app}
                key={app.windowID}
              />
            ))}
          </>
        )}
      </main>
      {MenuStartopen && (
        <Nav OpenApp={OpenApp} closeTaskbarsWindows={closeTaskbarsWindows} />
      )}
      {WindowSearchOpen && (
        <Search OpenApp={OpenApp} closeTaskbarsWindows={closeTaskbarsWindows} />
      )}
      <Taskbar
        closeTaskbarsWindows={closeTaskbarsWindows}
        setMenuStartopen={setMenuStartopen}
        setWindowSearchOpen={setWindowSearchOpen}
        MenuStartopen={MenuStartopen}
        WindowSearchOpen={WindowSearchOpen}
        apps={openWindows}
      />
    </>
  );
}
