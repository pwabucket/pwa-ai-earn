import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import AppContext from "./contexts/AppContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import useGoogleApi from "./hooks/useGoogleApi";
import useGoogleDriveBackup from "./hooks/useGoogleDriveBackup";

function App() {
  const googleApi = useGoogleApi();
  const googleDriveBackup = useGoogleDriveBackup(googleApi);
  return (
    <>
      <AppContext.Provider
        value={{
          googleApi,
          googleDriveBackup,
        }}
      >
        <div className="min-h-dvh flex flex-col bg-neutral-900 text-white">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </div>
      </AppContext.Provider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!bg-neutral-800 !text-neutral-100 !rounded-full",
        }}
      />
    </>
  );
}

export default App;
