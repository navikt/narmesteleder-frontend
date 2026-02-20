"use client";
import { RegistreringViewControlProvider } from "@/app/(registrering)/state/contextState";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

export function ViewControl() {
  return (
    <RegistreringViewControlProvider
      EditView={EditView}
      SubmitView={SubmitView}
    />
  );
}
