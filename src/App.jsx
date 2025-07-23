import { Route, Routes } from "react-router";

import Home from "./pages/Home";
import Menu from "./pages/Menu";

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-neutral-900 text-white">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </div>
  );
}

export default App;
