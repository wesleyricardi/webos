import "../styles/config/global.css";
import "../styles/config/paleta.css";
import "../styles/global.css";
import "../styles/form.css";
import "../styles/extra.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
