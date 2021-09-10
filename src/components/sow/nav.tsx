import style from "../../styles/sow/nav.module.css";
import Apps from "./apps";
import startMenuApps from "./startMenuApps.json";

type Props = {
  OpenApp: (id: string) => void;
  closeTaskbarsWindows: () => void;
};

type Event = {
  currentTarget: HTMLElement;
};

export default function nav({ OpenApp, closeTaskbarsWindows }: Props) {
  function expande({ currentTarget: leftBar }: Event): void {
    leftBar.style.width = "200px";
    const elements = document.getElementsByClassName("show");
    for (let index = 0; index < elements.length; index++) {
      (elements[index] as HTMLElement).style.display = "";
    }
  }

  function retract(): void {
    (document.getElementById("startMenu_leftBar") as HTMLElement).style.width =
      "";
    const elements = document.getElementsByClassName("show");
    for (let index = 0; index < elements.length; index++) {
      (elements[index] as HTMLElement).style.display = "none";
    }
  }

  function showAllApps({ currentTarget }: Event): void {
    const allAppsContainer = currentTarget.parentNode as HTMLElement;
    const allApps = document.getElementById("all_apps") as HTMLElement;
    if (allAppsContainer.style.minHeight === "100%") {
      allAppsContainer.style.minHeight = "";
      allAppsContainer.style.backgroundColor = "";
      allApps.style.display = "none";
    } else {
      allAppsContainer.style.minHeight = "100%";
      allAppsContainer.style.backgroundColor = "var(--color-light)";
      allApps.style.display = "block";
    }
  }

  return (
    <nav className={style.menuStart}>
      <div id="startMenu_leftBar" onClick={expande}>
        <ul>
          <span>
            <img src="/user.svg" alt="" />
            <span style={{ display: "none" }} className="show">
              Usuario
            </span>
          </span>
          <div style={{ display: "none" }} className="show">
            <li>Conta</li>
            <li>Mudar senha</li>
            <li>Deslogar</li>
          </div>
        </ul>
        <ul>
          <span>
            <img src="/setting.svg" alt="" />
            <span style={{ display: "none" }} className="show">
              Configurações
            </span>
          </span>
        </ul>
      </div>
      <div onClick={retract}>
        {startMenuApps.map((value, index_category) => (
          <ul className={style.apps} key={"category_" + index_category}>
            <span>{value.category}</span>
            {value.apps.map((app, index_app) => (
              <li
                key={"app_" + index_app}
                onClick={() => {
                  OpenApp(app.id);
                  closeTaskbarsWindows();
                }}
              >
                <img src={app.icon} alt="" />
                <span>{app.nome}</span>
              </li>
            ))}
          </ul>
        ))}
        <div className={style.allapps}>
          <span onClick={showAllApps}>▲ todas as aplicações</span>
          <ul className={style.apps} id="all_apps" style={{ display: "none" }}>
            {Apps.map((app, index) => (
              <li
                key={"allapp_" + index}
                onClick={() => {
                  OpenApp(app.id);
                  closeTaskbarsWindows();
                }}
              >
                <img src={app.icon} alt="" />
                <span>{app.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
