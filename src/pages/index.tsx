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

type lastOpens = {
  id: string;
  name: string;
  icon: string;
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

interface Element extends HTMLElement {
  parentNode: Element;
  childrenNode: HTMLCollectionOf<Element>;
  classList: DOMTokenList;
}

export default function FloatWindow() {
  const [MenuStartopen, setMenuStartopen] = useState<boolean>(false);
  const [WindowSearchOpen, setWindowSearchOpen] = useState<boolean>(false);
  const [openWindows, setOpenWindows] = useState<OpenApps[]>([]);

  let toResizeX: ResizeX | null;
  let toResizeY: ResizeY | null;
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

        setLastOpenApp(App);
        setMostUseApps(App);
      }
    });
  }

  function setLastOpenApp(App: any) {
    if (typeof Storage !== "undefined") {
      let lastOpens: lastOpens[];
      const jsonLastOpen = localStorage.getItem("lastopens");

      if (jsonLastOpen) {
        lastOpens = JSON.parse(jsonLastOpen);
        const appIndex = lastOpens.findIndex((app) => app.id === App.id);

        if (appIndex >= 0) {
          lastOpens.splice(appIndex, 1);
        } else if (lastOpens.length > 4) lastOpens.splice(4);

        lastOpens = [
          { id: App.id, name: App.name, icon: App.icon },
          ...lastOpens,
        ];
      } else lastOpens = [{ id: App.id, name: App.name, icon: App.icon }];

      localStorage.setItem("lastopens", JSON.stringify(lastOpens));
    }
  }

  function setMostUseApps(App: any) {
    if (typeof Storage !== undefined) {
      let mostUseApps: any[];
      const jsonMostUseApps = localStorage.getItem("mostuseapps");

      if (jsonMostUseApps) {
        mostUseApps = JSON.parse(jsonMostUseApps);
        const AppIndex = mostUseApps.findIndex((app) => app.id === App.id);

        if (AppIndex >= 0) {
          mostUseApps[AppIndex].openings++;
        } else {
          mostUseApps = [
            { id: App.id, name: App.name, icon: App.icon, openings: 1 },
            ...mostUseApps,
          ];
        }
      } else {
        mostUseApps = [
          { id: App.id, name: App.name, icon: App.icon, openings: 1 },
        ];
      }

      localStorage.setItem("mostuseapps", JSON.stringify(mostUseApps));
    }
  }

  function closeWindow(id: string): void {
    const newOpenWindows = openWindows.filter((app) => {
      if (app.windowID !== id) return app;
    });
    setOpenWindows(newOpenWindows);
  }

  function zindex(window: HTMLElement) {
    if (window.style.zIndex !== "1000") {
      window.style.zIndex = "1000";
      const windows = document.getElementsByClassName(
        "windows"
      ) as HTMLCollectionOf<Element>;
      for (let index = 0; index < windows.length; index++) {
        console.log(windows[index]);
        windows[index].style.zIndex = `${
          parseInt(windows[index].style.zIndex) - 2
        }`;
      }
      window.style.zIndex = "1000";
    }
  }

  function select(e: any): void {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const h = e.currentTarget.offsetHeight;
    const w = e.currentTarget.offsetWidth;

    if (
      e.currentTarget === e.target ||
      x <= 3 ||
      y <= 3 ||
      x >= w - 3 ||
      y >= h - 3 ||
      y >= 30
    ) {
      const coordinates = { x: e.clientX, y: e.clientY };

      if (e.currentTarget.style.minWidth !== "100vw") {
        if (x <= 3) {
          toResizeX = {
            element: e.currentTarget,
            w,
            origem: "left",
            x,
            coordinates,
          };
        }

        if (x >= w - 3) {
          toResizeX = {
            element: e.currentTarget,
            w,
            origem: "right",
            x,
            coordinates,
          };
        }

        if (y <= 3) {
          toResizeY = {
            element: e.currentTarget,
            h,
            origem: "top",
            y,
            coordinates,
          };
        }

        if (y >= h - 3) {
          toResizeY = {
            element: e.currentTarget,
            h,
            origem: "bottom",
            y,
            coordinates,
          };
        }
      }

      if (x > 3 && y > 3 && x < w - 3 && y < h - 3 && y < 30)
        toMove = { element: e.currentTarget, x, y };
    }
  }

  function unselect(): void {
    toMove = null;
    toResizeX = null;
    toResizeY = null;
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

    if (toResizeX) {
      if (toResizeX.origem === "left") {
        if (toResizeX.coordinates.x - x + toResizeX.w >= 200) {
          toResizeX.element.style.left = x - toResizeX.x + "px";
          toResizeX.element.style.width =
            toResizeX.coordinates.x - x + toResizeX.w + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "w-resize";
        }
      }

      if (toResizeX.origem === "right") {
        if (x - toResizeX.coordinates.x + toResizeX.w > 200) {
          toResizeX.element.style.width =
            x - toResizeX.coordinates.x + toResizeX.w + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "w-resize";
        }
      }
    }

    if (toResizeY) {
      if (toResizeY.origem === "top") {
        if (toResizeY.coordinates.y - y + toResizeY.h >= 100) {
          toResizeY.element.style.top = y - toResizeY.y + "px";
          toResizeY.element.style.height =
            toResizeY.coordinates.y - y + toResizeY.h + "px";
          (document.getElementById("main") as HTMLElement).style.cursor =
            "n-resize";
        }
      }

      if (toResizeY.origem === "bottom") {
        if (y - toResizeY.coordinates.y + toResizeY.h > 100) {
          toResizeY.element.style.height =
            y - toResizeY.coordinates.y + toResizeY.h + "px";
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
                zindex={zindex}
                app={app}
                key={"window_" + app.windowID}
              />
            ))}
          </>
        )}
      </main>
      
      <Taskbar
        closeTaskbarsWindows={closeTaskbarsWindows}
        setMenuStartopen={setMenuStartopen}
        setWindowSearchOpen={setWindowSearchOpen}
        MenuStartopen={MenuStartopen}
        WindowSearchOpen={WindowSearchOpen}
        zindex={zindex}
        apps={openWindows}
      >
      <>{MenuStartopen && (
        <Nav OpenApp={OpenApp} closeTaskbarsWindows={closeTaskbarsWindows} />
      )}
      {WindowSearchOpen && (
        <Search OpenApp={OpenApp} closeTaskbarsWindows={closeTaskbarsWindows} />
      )}</>
      </Taskbar>
    </>
  );
}
