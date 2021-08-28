type Props = {
  OpenApp: (id: "string") => void;
};

const desktopShortcuts = [
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
  {
    id: "5k78u7",
    nome: "Easy",
    icon: "/apps/easy.png",
  },
];

export default function Desktop({ OpenApp }: Props) {
  return (
    <section>
      {/* {Apps.map((app) => (
          <button key={"bt_" + app.id} onClick={() => OpenApp(app)}>
            {app.name}
          </button>
        ))} */}
    </section>
  );
}
