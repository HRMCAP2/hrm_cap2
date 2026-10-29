'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AccountList } from '@/components/accounts/AccountList';

export default function AccountsPage() {
  return (
    <AppShell>
      <AccountList />
    </AppShell>
  );
}
