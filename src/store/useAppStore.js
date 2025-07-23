import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createGoogleDriveSlice } from "./googleDriveSlice";
import { createInvestmentSlice } from "./investmentSlice";
import { createWithdrawalSlice } from "./withdrawalSlice";

const useAppStore = create(
  persist(
    (...a) => ({
      ...createInvestmentSlice(...a),
      ...createWithdrawalSlice(...a),
      ...createGoogleDriveSlice(...a),
    }),
    {
      name: "app-storage",
    }
  )
);

export default useAppStore;
