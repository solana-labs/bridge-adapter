import { AxiosError } from "axios";
import type { ContractExecutionError } from "web3";

type AllbridgeCoreError = AxiosError<{ message?: string }>;
type ApiError = Error | AllbridgeCoreError | ContractExecutionError;

function handleAxiosError(error: AllbridgeCoreError) {
  return error.response?.data.message || "Request Error";
}

function handleContractExecutionError(error: ContractExecutionError) {
  return error.innerError.message;
}

export const handleApiError = (error?: unknown) => {
  if (!error) return "Absent Error";
  const anyError = error as ApiError;

  if ("name" in anyError && anyError.name === "AxiosError") {
    return handleAxiosError(anyError as AllbridgeCoreError);
  } else if (
    "innerError" in anyError &&
    anyError.name === "ContractExecutionError"
  ) {
    return handleContractExecutionError(anyError as ContractExecutionError);
  } else {
    return (error as { message?: string })?.message || "Unrecognized error";
  }
};
