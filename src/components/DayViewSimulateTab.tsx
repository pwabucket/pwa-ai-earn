import { Tabs } from "radix-ui";

import Simulation from "./Simulation";

export const SimulateTab = ({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) => (
  <Tabs.Content value="simulate" className="flex flex-col gap-2">
    <Simulation selectedDate={selectedDate} onSelectDate={onSelectDate} />
  </Tabs.Content>
);
