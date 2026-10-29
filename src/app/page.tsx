'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { AppShell } from '@/components/layout/AppShell';
import { HRDashboard } from '@/components/dashboard/HRDashboard';
import { LeadDashboard } from '@/components/dashboard/LeadDashboard';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';
import { AccountantDashboard } from '@/components/dashboard/AccountantDashboard';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <AppShell>
      {currentUser?.role === 'HR' && <HRDashboard />}
      {currentUser?.role === 'Lead' && <LeadDashboard />}
      {currentUser?.role === 'Employee' && <EmployeeDashboard />}
      {currentUser?.role === 'Accountant' && <AccountantDashboard />}
    </AppShell>
  );
}
