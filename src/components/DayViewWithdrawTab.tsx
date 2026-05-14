import { LuMaximize2, LuMinus, LuRefreshCw } from "react-icons/lu";
import { Tabs } from "radix-ui";

import { ActionButton, ButtonGroup, InputSection } from "./DayViewControls";
import { DayViewCurrencyInput } from "./DayViewCurrencyInput";

export const WithdrawTab = ({
  withdrawalAmount,
  setWithdrawalAmount,
  handleMaxWithdrawal,
  handleWithdraw,
  handleReInvest,
}: {
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  handleMaxWithdrawal: () => void;
  handleWithdraw: () => void;
  handleReInvest: () => void;
}) => (
  <Tabs.Content value="withdraw" className="flex flex-col gap-2">
    <InputSection>
      <DayViewCurrencyInput
        value={withdrawalAmount}
        onChange={setWithdrawalAmount}
      />
      <ActionButton onClick={handleMaxWithdrawal}>
        <LuMaximize2 className="size-4" />
        Max
      </ActionButton>
    </InputSection>

    <ButtonGroup>
      <ActionButton onClick={handleReInvest} variant="secondary">
        <LuRefreshCw className="size-4" />
        Re-Invest
      </ActionButton>
      <ActionButton onClick={handleWithdraw}>
        <LuMinus className="size-4" />
        Withdraw
      </ActionButton>
    </ButtonGroup>
  </Tabs.Content>
);
