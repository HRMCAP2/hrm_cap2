'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { EmployeeList } from '@/components/employees/EmployeeList';

export default function EmployeesPage() {
  return (
    <AppShell>
      <EmployeeList />
    </AppShell>
  );
}
