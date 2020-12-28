import { atom } from "recoil";

export const userMoneyState = atom({
  key: "userMoney",
  default: { cash: 0, investments: 0 },
});
