import { useContext } from "react";
import { RequestContext } from "./request_context";

export function useRequestStore() {
  return useContext(RequestContext);
}
