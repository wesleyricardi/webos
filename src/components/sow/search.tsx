import { useState } from "react";
import style from "../../styles/sow/search.module.css";
import Apps from "./apps";

type Props = {
  OpenApp: (app: string) => void;
  closeTaskbarsWindows: () => void;
};

type SearchResult = { id: string; name: string; icon: string }[] | null;

function Search({ OpenApp, closeTaskbarsWindows }: Props) {
  const [SearchResult, setSearchResult] = useState<SearchResult>(null);

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
        <>
          <h4>Melhor correspondencia:</h4>
          {SearchResult.map((result) => (
            <div
              onClick={() => {
                OpenApp(result.id);
                closeTaskbarsWindows();
              }}
            >
              <img src={result.icon} alt="" />
              {result.name}
            </div>
          ))}
        </>
      ) : (
        <div>Mais usados</div>
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
        />
      </div>
    </div>
  );
}

export default Search;
