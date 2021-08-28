import App1 from "../apps/app1";
import App2 from "../apps/app2";
import App3 from "../apps/app3";

const Apps = [
  {
    id: "4j5gf6",
    name: "Hello World",
    component: <App1 />,
    icon: "/apps/helloworld.svg",
    windowStyle: ``,
    windowID: "1vtc4c", //APPS COM windowID preenchidas só abrem uma unica janela
  },
  {
    id: "8n96u7",
    name: "Input Text",
    component: <App2 />,
    icon: "/apps/favicon.ico",
    windowStyle: ``,
    windowID: "",
  },
  {
    id: "5k78u7",
    name: "Easy",
    component: <App3 />,
    icon: "/apps/easy.png",
    windowStyle: ``,
    windowID: "",
  },
];
export default Apps;
