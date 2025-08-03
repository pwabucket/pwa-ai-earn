import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import AppContext from "./contexts/AppContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
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
            {/* Home */}
            <Route index element={<Home />} />

            {/* Menu */}
            <Route path="/menu" element={<Menu />} />

            {/* Privacy Policy */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />

            {/* Terms */}
            <Route path="terms-of-service" element={<TermsOfService />} />
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
