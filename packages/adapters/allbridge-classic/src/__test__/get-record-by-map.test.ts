import it from "ava";
import { getMapValueByRecords } from "../entities/utils/get-map-value-by-records";

it("should return record by map", (t) => {
  const records: { [key: string]: { field: any } } = {
    A: { field: "A" },
    B: { field: "B" },
  };
  const map = new Map([["A", { data: "A'" }]]);
  t.deepEqual(
    getMapValueByRecords(records, map, (r) => r["field"]),
    [{ data: "A'" }],
  );
});
