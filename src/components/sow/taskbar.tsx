import { useEffect, useState } from "react";
import style from "../../styles/sow/taskbar.module.css";
import Nav from "./nav";

type Props = {
  MenuStartopen: boolean;
  setMenuStartopen: (Arg: boolean) => void;
  WindowSearchOpen: boolean;
  setWindowSearchOpen: (Arg: boolean) => void;
  closeTaskbarsWindows: () => void;
  apps: {
    windowID: string;
    name: string;
  }[];
};

type Datetime = {
  hour: string;
  date: string;
};

export default function Taskbar({
  apps,
  MenuStartopen,
  setMenuStartopen,
  WindowSearchOpen,
  setWindowSearchOpen,
  closeTaskbarsWindows,
}: Props) {
  const [Datetime, setDatetime] = useState<Datetime | null>(null);

  function minimaze(window: HTMLElement, minWindow: HTMLElement) {
    window.style.transition = "all 300ms ease";
    window.style.maxWidth = minWindow.offsetWidth + "px";
    window.style.maxHeight = minWindow.offsetHeight + "px";
    window.style.transform = `translateX(${
      minWindow.offsetLeft - parseInt(window.style.left.slice(0, -2))
    }px) translateY(100vh)`;
    window.style.opacity = "0";
    window.style.overflow = "auto";

    minWindow.style.backgroundColor = "transparent";
  }

  useEffect(() => {
    setInterval(function () {
      const date = new Date();
      setDatetime({
        hour: `${("00" + date.getHours()).slice(-2)}:${(
          "00" + date.getMinutes()
        ).slice(-2)}`,
        date: `${("00" + date.getDate()).slice(-2)}/${(
          "00" +
          (date.getMonth() + 1)
        ).slice(-2)}/${date.getFullYear()}`,
      });
    }, 1000);
  }, []);

  function maximize(e: any) {
    const minWindow = e.currentTarget;
    const window = document.getElementById(
      minWindow.id.slice(4)
    ) as HTMLElement;
    if (window.style.opacity === "0") {
      window.style.maxWidth = "";
      window.style.maxHeight = "";
      window.style.transform = "";
      window.style.opacity = "";
      window.style.overflow = "";
      minWindow.style.backgroundColor = "";
      new Promise((r) => setTimeout(r, 300)).then(
        () => (window.style.transition = "")
      );
    } else minimaze(window, minWindow);
  }

  return (
    <div className={style.taskbar}>
      <span
        onClick={() => {
          closeTaskbarsWindows();
          if (!MenuStartopen) setMenuStartopen(true);
        }}
      >
        <img height="25px" src="/menu-hamburgue.svg" alt="" />
      </span>
      <span
        onClick={() => {
          closeTaskbarsWindows();
          if (!WindowSearchOpen) setWindowSearchOpen(true);
        }}
      >
        <img height="17px" src="/lupa.svg" alt="" />
      </span>
      {apps.map((app) => (
        <div
          key={"min_" + app.windowID}
          onClick={(e) => {
            maximize(e);
            closeTaskbarsWindows();
          }}
          id={`min-${app.windowID}`}
        >
          {app.name}
        </div>
      ))}

      <div>
        {Datetime?.hour}
        <span>{Datetime?.date}</span>
      </div>
    </div>
  );
}
