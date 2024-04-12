"use client"

import * as React from "react"
import Link from 'next/link'
import { toast } from "sonner"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { deleteCustomer, updateCustomer } from "../actions/customer.action"


export default function DataTableDemo({customers}) {
  const [customerData, setCustomerData] = React.useState(customers);
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [filterBy,setFilterBy] = React.useState('partyName')
  const columns = [
    {
      accessorKey: "isCompleted",
      enableHiding: false,
      header: () => <div className="text-left">Work Status</div>,
      cell: ({ row }) => {
        const customer = row.original;
        const status = row.getValue("isCompleted");
        const bg = status==='progress' ? 'bg-yellow-500' : status==='completed' ? 'bg-green-500' : 'bg-red-500';
        return <select className={cn("text-left p-2 font-bold rounded-xl",bg)} value={status} onChange={(e)=>handleWork(customer._id,e)}><option className="bg-white text-black dark:bg-zinc-800 dark:text-white" value="progress">Progress</option><option className="bg-white text-black dark:bg-zinc-800 dark:text-white" value="completed">Completed</option><option className="bg-white text-black dark:bg-zinc-800 dark:text-white" value="canceled">Canceled</option></select>
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formattedDate = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
      return <div className="lowercase text-left">{formattedDate}</div>},
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Delivery Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
      const date = new Date(row.getValue('expectedDeliveryDate'));
      const formattedDate = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
      return <div className="lowercase text-left">{formattedDate}</div>},
    },
    {
      accessorKey: "partyName",
      header: "Party Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("partyName")}</div>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Phone No.",
      cell: ({ row }) => <div className="lowercase text-left">{row.getValue("mobile")}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-left">Total Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"))
        
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(amount)
  
        return <div className="text-left font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "balance",
      header: () => <div className="text-left">Balance</div>,
      cell: ({ row }) => { 
        const amount = parseFloat(row.getValue("balance"))
        
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(amount)
  
        return <div className="text-left font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {navigator.clipboard.writeText(customer._id);toast.success("Id Copied")}}
                >
                Copy Customer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link href={`customers/${customer._id}`}>View customer</Link></DropdownMenuItem>
              <DropdownMenuItem><Link href={`customers/${customer._id}/update`}>Update customer</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={()=>handleDelete(customer._id)}>Delete customer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
  const handleWork = async (id,e)=>{
    const data = {id,isCompleted:e.target.value}
    const toastid = toast.loading("Updating..");
    try {
      const response = await updateCustomer(data);
      if (response) {
        const updatedCustomerData = customerData.map(customer => {
          if (customer._id === id) {
            return { ...customer, isCompleted: data.isCompleted };
          }
          return customer;
        });
        setCustomerData(updatedCustomerData);
        toast.success("Customer updated Successfully",{id:toastid});
      } else {
        toast.error("Failed to update!",{id:toastid});
      }
  }
  catch(e){console.log("error",e)}
  }
  const handleDelete = async (id) => {
    const toastid = toast.loading("Deleting...");
    try {
      const response = await deleteCustomer(id);
      if (response) {
        const updatedCustomers = customerData.filter(
          (customer) => customer._id !== id
        );
        setCustomerData(updatedCustomers);
        toast.success('Customer deleted successfully!',{id:toastid});
      } else {
        toast.error('Failed to delete customer!',{id:toastid});
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('An error occurred while deleting customer!',{id:toastid});
    }
  };
  const table = useReactTable({
    data:customerData,
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
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterBy}...`}
          value={(table.getColumn(filterBy)?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn(filterBy)?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-2"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto mr-1">
              Filter By <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={()=>setFilterBy('mobile')}>Phone No.</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>setFilterBy('partyName')}>Party Name</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>setFilterBy('isCompleted')}>Completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id==='mobile'?"Phone no.":column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-left md:text-center"
                >
                  No Customer Data..
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {table.getFilteredRowModel().rows.length} rows.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
          >
            First page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount()-1)}
          >
            Last Page
          </Button>
        </div>
      </div>
    </div>
  )
}
