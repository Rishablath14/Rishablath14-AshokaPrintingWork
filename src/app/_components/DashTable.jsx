"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CustomerContext } from "./CustomerContext";
import { deleteCustomer, updateCustomer } from "../actions/customer.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statusClasses = {
  progress: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
  canceled: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export default function DashTableDemo() {
  const { customers, refreshCustomers } = React.useContext(CustomerContext);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterBy, setFilterBy] = React.useState("partyName");
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const customerData = React.useMemo(
    () => customers.filter((customer) => customer.isCompleted === "progress"),
    [customers],
  );

  const handleStatusChange = React.useCallback(async (id, value) => {
    const toastId = toast.loading("Updating queue...");

    try {
      await updateCustomer(id, { isCompleted: value });
      await refreshCustomers();
      toast.success("Queue updated", { id: toastId });
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Could not update queue", { id: toastId });
    }
  }, [refreshCustomers]);

  const openDeleteDialog = React.useCallback((id) => {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }, []);

  const cancelDelete = React.useCallback(() => {
    setDeleteTargetId(null);
    setShowDeleteDialog(false);
  }, []);

  const handleDelete = React.useCallback(async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting job...");

    try {
      await deleteCustomer(deleteTargetId);
      await refreshCustomers();
      toast.success("Job deleted", { id: toastId });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Could not delete job", { id: toastId });
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
      setShowDeleteDialog(false);
    }
  }, [deleteTargetId, refreshCustomers]);

  const columns = React.useMemo(() => [
    {
      accessorKey: "isCompleted",
      enableHiding: false,
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        const customer = row.original;
        const status = row.getValue("isCompleted");

        return (
          <select
            className={cn(
              "status-select min-w-[8.75rem] rounded-full border px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-sky-400/20",
              statusClasses[status] || statusClasses.progress,
            )}
            value={status}
            onChange={(event) => handleStatusChange(customer._id, event.target.value)}
          >
            <option value="progress">Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="h-auto px-0 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:bg-transparent hover:text-slate-900 dark:hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium text-slate-900 dark:text-slate-100">{formatDate(row.getValue("date"))}</div>,
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="h-auto px-0 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:bg-transparent hover:text-slate-900 dark:hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Date
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <div>{formatDate(row.getValue("expectedDeliveryDate"))}</div>,
    },
    {
      accessorKey: "billNumber",
      header: "Bill Number",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("billNumber") || "-"}</div>,
    },
    {
      accessorKey: "partyName",
      header: "Customer",
      cell: ({ row }) => <div className="font-medium text-slate-900 dark:text-slate-100">{row.getValue("partyName")}</div>,
    },
    {
      accessorKey: "mobile",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: () => <div>Total</div>,
      cell: ({ row }) => <div className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(row.getValue("totalAmount"))}</div>,
    },
    {
      accessorKey: "advance",
      header: () => <div>Balance</div>,
      cell: ({ row }) => {
        const amount = Number(row.getValue("totalAmount")) || 0;
        const advance = Number(row.getValue("advance")) || 0;
        return <div>{formatCurrency(amount - advance)}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-10 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
              <DropdownMenuLabel>Queue Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(customer._id); toast.success("Customer ID copied"); }}>
                Copy Customer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/customers/${customer._id}`}>View customer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/customers/${customer._id}/custom`}>Add more</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/customers/${customer._id}/update`}>Update customer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDeleteDialog(customer._id)} className="text-red-600 focus:bg-red-50 dark:text-red-300 dark:focus:bg-red-500/10">
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [openDeleteDialog, handleStatusChange]);

  const table = useReactTable({
    data: customerData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <section className="surface-card p-5 md:p-6">
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-950 dark:text-white">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Confirm Delete</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Delete this job?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  This action cannot be undone. The selected job will be permanently removed.
                </p>
              </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelDelete}
                className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete job'}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-heading">Active Production Queue</h2>
            <p className="section-copy">View and manage all ongoing printing projects.</p>
          </div>
          <div className="surface-card-muted inline-flex items-center gap-2 self-start px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {table.getFilteredRowModel().rows.length} pending jobs
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input
            placeholder={`Search by ${filterBy === "partyName" ? "customer name" : filterBy === "mobile" ? "phone number" : "status"}...`}
            value={table.getColumn(filterBy)?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn(filterBy)?.setFilterValue(event.target.value)}
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter Field
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
                <DropdownMenuItem onClick={() => setFilterBy("mobile")}>Phone number</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("partyName")}>Customer name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("isCompleted")}>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "mobile" ? "Phone" : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-28 text-center text-sm text-slate-500 dark:text-slate-400">
                    No pending jobs right now.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              First
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              Last
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
