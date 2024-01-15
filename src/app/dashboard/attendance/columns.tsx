'use client';

import { type ColumnDef } from '@tanstack/react-table';

export interface User {
  name: string;
  rollNo: string;
  status: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'rollNo',
    header: 'Roll. No.',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];
