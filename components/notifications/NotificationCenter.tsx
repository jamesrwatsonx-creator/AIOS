"use client";

import { useEffect } from "react";
import { readNotifications } from "@/lib/notifications";

export function NotificationCenter() {
  useEffect(() => {
    readNotifications();
  }, []);
  return null;
}
