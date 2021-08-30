import style from "../../styles/sow/nav.module.css";
import startMenuApps from "./startMenuApps.json";

type Props = {
  OpenApp: (id: string) => void;
  closeTaskbarsWindows: () => void;
};

export default function nav({ OpenApp, closeTaskbarsWindows }: Props) {
  return (
    <nav className={style.menuStart}>
      <div>
        <span>
          <img src="/user.svg" alt="" />
        </span>
        <span>
          <img src="/setting.svg" alt="" />
        </span>
      </div>
      <div>
        {startMenuApps.map((value, index_category) => (
          <ul key={"category_" + index_category}>
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
        <span>▲ todas as aplicações</span>
      </div>
    </nav>
  );
}
