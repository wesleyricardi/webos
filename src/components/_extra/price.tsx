export default function Price({ children }) {
  return <>R$ {(children / 100).toFixed(2).toString().replace(".", ",")}</>;
}
