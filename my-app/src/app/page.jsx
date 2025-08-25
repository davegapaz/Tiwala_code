"use client";
import React from "react";
import { UserSelector } from "@/components/UserSelector";
import { Dashboard } from "@/components/Dashboard";
import { useTiwala } from "@/context/TiwalaContext";

export default function HomePage() {
  const { state } = useTiwala();

  if (!state?.currentUser) {
    return <UserSelector />;
  }

  return <Dashboard />;
}
