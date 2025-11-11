import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createGoogleDriveSlice,
  type GoogleDriveSlice,
} from "./googleDriveSlice";
import { createInvestmentSlice, type InvestmentSlice } from "./investmentSlice";
import { createWithdrawalSlice, type WithdrawalSlice } from "./withdrawalSlice";
import { createAppSlice, type AppSlice } from "./appSlice";

const useAppStore = create(
  persist<AppSlice & InvestmentSlice & WithdrawalSlice & GoogleDriveSlice>(
    (...a) => ({
      ...createAppSlice(...a),
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
