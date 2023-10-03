import it from "ava";
import { cn } from "./styles";

it("should build className", (t) => {
  t.is("bsa-p-2", cn("bsa-p-1", "bsa-p-2"));
});
