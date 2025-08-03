import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createGoogleDriveSlice,
  type GoogleDriveSlice,
} from "./googleDriveSlice";
import { createInvestmentSlice, type InvestmentSlice } from "./investmentSlice";
import { createWithdrawalSlice, type WithdrawalSlice } from "./withdrawalSlice";

const useAppStore = create(
  persist<WithdrawalSlice & InvestmentSlice & GoogleDriveSlice>(
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
