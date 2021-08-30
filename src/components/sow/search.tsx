import { useEffect, useState } from "react";
import style from "../../styles/sow/search.module.css";
import Apps from "./apps";
import defaultMostUsedApp from "./defaultMostUsedApp.json";

type Props = {
  OpenApp: (app: string) => void;
  closeTaskbarsWindows: () => void;
};

type SearchResult = { id: string; name: string; icon: string }[] | null;

function Search({ OpenApp, closeTaskbarsWindows }: Props) {
  const [SearchResult, setSearchResult] = useState<SearchResult>(null);
  const [MostUseApp, setMostUseApp] = useState(defaultMostUsedApp);
  const [LatestOpenApp, setLatestOpenApp] = useState<
    | {
        id: string;
        name: string;
        icon: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    const jsonMostUseApps = localStorage.getItem("mostuseapps");
    if (jsonMostUseApps) setMostUseApp(JSON.parse(jsonMostUseApps));

    const jsonLatestOpenApp = localStorage.getItem("lastopens");
    if (jsonLatestOpenApp) setLatestOpenApp(JSON.parse(jsonLatestOpenApp));
  }, []);

  function doSearch(value: string): void {
    if (value.length >= 3) {
      const result = Apps.filter((App) => {
        if (App.name.toLowerCase().indexOf(value.toLowerCase()) != -1)
          return App;
      });
      setSearchResult(result);
    } else {
      setSearchResult(null);
    }
  }

  return (
    <div className={style.searchResult}>
      {SearchResult ? (
        <ul>
          <span>Melhor correspondencia</span>
          {SearchResult.map((result, index) => (
            <li
              key={"search_" + index}
              onClick={() => {
                OpenApp(result.id);
                closeTaskbarsWindows();
              }}
            >
              <img src={result.icon} alt="" />
              <span>{result.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div>
            <ul className={style.mostUses}>
              <span>Aplicações mais usadas</span>
              {MostUseApp?.map((app) => (
                <li
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
          {LatestOpenApp && (
            <ul>
              <span>Aplicações recentemente abertas</span>
              {LatestOpenApp.map((app) => (
                <li
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
          )}
        </>
      )}
      <div>
        <label htmlFor="search">
          <img src="/lupa.svg" alt="" />
        </label>
        <input
          onChange={(e) => doSearch(e.target.value)}
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          autoFocus
        />
      </div>
    </div>
  );
}

export default Search;
