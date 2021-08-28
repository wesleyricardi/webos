import style from "../../styles/sow/window.module.css";
import CSSstring from "../_extra/cssString";

type Props = {
  app: {
    id: string;
    name: string;
    component: JSX.Element;
    windowStyle: string;
    windowID: string;
  };

  select: (e: any) => void;
  unselect: (e: any) => void;
  closeWindow: (e: any) => void;
};

interface Element extends HTMLElement {
  parentNode: Element;
  childrenNode: HTMLCollectionOf<Element>;
  classList: DOMTokenList;
}

function window(props: Props) {
  function fullWindow(window: HTMLElement) {
    window.style.transition = "all 100ms ease";
    if (window.style.minWidth == "100vw") {
      window.style.minWidth = "";
      window.style.minHeight = "";
      window.style.transform = "";
      window.style.padding = "";
      window.style.boxShadow = "";
      (
        document.getElementById("fullWindowHandle_" + window.id) as HTMLElement
      ).innerHTML = "□";
    } else {
      if (!window.style.height)
        window.style.height = window.offsetHeight + "px";
      if (!window.style.width) window.style.width = window.offsetWidth + "px";
      window.style.minWidth = "100vw";
      window.style.minHeight = "calc(100vh - 40px)";
      window.style.transform = `translateX(-${window.offsetLeft}px) translateY(-${window.offsetTop}px)`;
      window.style.padding = "30px 0 0 0";
      window.style.boxShadow = "none";
      (
        document.getElementById("fullWindowHandle_" + window.id) as HTMLElement
      ).innerHTML = "❐";
    }

    new Promise((r) => setTimeout(r, 100)).then(
      () => (window.style.transition = "")
    );
  }

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

  function handleminimaze(e: any): any {
    const window = e.currentTarget?.parentNode?.parentNode as HTMLElement;
    const minWindow = document.getElementById(
      `min-${window.id}`
    ) as HTMLElement;
    minimaze(window, minWindow);
  }

  function hover(e: any): void {
    if (
      e.currentTarget === e.target &&
      e.currentTarget.style.minWidth !== "100vw"
    ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const h = e.currentTarget.offsetHeight;
      const w = e.currentTarget.offsetWidth;
      const main = document.getElementById("main") as HTMLElement;

      if (x <= 3) main.style.cursor = "w-resize";
      else if (x >= w - 3) main.style.cursor = "w-resize";
      else if (y <= 3) main.style.cursor = "n-resize";
      else if (y >= h - 3) main.style.cursor = "n-resize";
      else main.style.cursor = "auto";
    }
  }

  function hoverout(): void {
    (document.getElementById("main") as HTMLElement).style.cursor = "auto";
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
          parseInt(windows[index].style.zIndex) - 1
        }`;
      }
      window.style.zIndex = "1000";
    }
  }

  return (
    <div
      id={props.app.windowID}
      className={`${style.window} windows`}
      onMouseUp={props.unselect}
      onMouseDown={(e) => {
        props.select(e);
        zindex(e.currentTarget);
      }}
      onDoubleClick={(e) => fullWindow(e.currentTarget)}
      onMouseMove={hover}
      onMouseOut={hoverout}
      style={CSSstring(props.app.windowStyle + "z-index: 1001")}
    >
      <span>{props.app.name}</span>
      <div>
        <span onClick={handleminimaze}>—</span>
        <span
          id={"fullWindowHandle_" + props.app.windowID}
          onClick={(e) =>
            fullWindow((e.currentTarget as Element).parentNode.parentNode)
          }
        >
          □
        </span>
        <span onClick={() => props.closeWindow(props.app.windowID)}>x</span>
      </div>
      <div>{props.app.component}</div>
    </div>
  );
}

export default window;
