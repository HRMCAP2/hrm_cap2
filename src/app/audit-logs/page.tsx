'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AuditLogList } from '@/components/audit/AuditLogList';

export default function AuditLogsPage() {
  return (
    <AppShell>
      <AuditLogList />
    </AppShell>
  );
}
