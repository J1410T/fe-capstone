import { ItemResponse } from ".";

export type FieldList = ItemResponse<FieldItem>;

export type FieldItem = {
  id: string;
  name: string;
};
