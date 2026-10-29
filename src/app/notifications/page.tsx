'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { NotificationListPage } from '@/components/notifications/NotificationListPage';

export default function NotificationsPage() {
  return (
    <AppShell>
      <NotificationListPage />
    </AppShell>
  );
}
