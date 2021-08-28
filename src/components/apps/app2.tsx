import { memo, useState } from "react";

function App2() {
  const [statecomponent, setstatecomponent] = useState("");

  return (
    <div>
      <input
        type="text"
        name="df"
        value={statecomponent}
        onChange={(e) => setstatecomponent(e.target.value)}
        id="fd"
      />
    </div>
  );
}

export default memo(App2);
