import { atom, atomFamily } from "recoil";

export const stocksArrayState = atom({
    key: 'stocksState',
    default: [],
  });