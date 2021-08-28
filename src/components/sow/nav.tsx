import style from "../../styles/sow/nav.module.css";

type Props = {
  OpenApp: (id: string) => void;
  closeTaskbarsWindows: () => void;
};

const startMenuApps = [
  {
    category: "Apps demonstração",
    apps: [
      {
        id: "4j5gf6",
        nome: "Hellow World",
        icon: "/apps/helloworld.svg",
      },
      {
        id: "8n96u7",
        nome: "Input Text",
        icon: "/apps/favicon.ico",
      },
    ],
  },
  {
    category: "Produtividade",
    apps: [
      {
        id: "5k78u7",
        nome: "Easy",
        icon: "/apps/easy.png",
      },
    ],
  },
];

export default function nav({ OpenApp, closeTaskbarsWindows }: Props) {
  return (
    <nav className={style.menuStart}>
      {startMenuApps.map((value) => (
        <ul>
          <span>{value.category}</span>
          {value.apps.map((app) => (
            <li
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
    </nav>
  );
}
