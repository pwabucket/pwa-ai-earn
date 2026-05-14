import { LuTrendingUp } from "react-icons/lu";
import { Tabs } from "radix-ui";

import { ActionButton, InputSection } from "./DayViewControls";
import { DayViewCurrencyInput } from "./DayViewCurrencyInput";
import { formatDate } from "../utils/dateUtils";

export const InvestTab = ({
  investmentAmount,
  setInvestmentAmount,
  handleInvest,
  endDate,
  onSelectDate,
}: {
  investmentAmount: string;
  setInvestmentAmount: (amount: string) => void;
  handleInvest: () => void;
  endDate: Date;
  onSelectDate: (date: Date) => void;
}) => (
  <Tabs.Content value="invest" className="flex flex-col gap-2">
    <InputSection>
      <DayViewCurrencyInput
        value={investmentAmount}
        onChange={(value) => setInvestmentAmount(value)}
      />
      <ActionButton onClick={handleInvest}>
        <LuTrendingUp className="size-4" />
        Invest
      </ActionButton>
    </InputSection>

    <p className="text-center text-sm text-neutral-400">
      Ends:{" "}
      <button
        onClick={() => onSelectDate(endDate)}
        className="text-pink-500 cursor-pointer"
      >
        {formatDate(endDate)}
      </button>
    </p>
  </Tabs.Content>
);
