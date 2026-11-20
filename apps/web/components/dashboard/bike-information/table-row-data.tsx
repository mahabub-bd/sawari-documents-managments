import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const TableRowData = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) => (
  <TableRow className="border-border/50 hover:bg-transparent">
    <TableCell className="w-[45%] py-2.5 pl-0 align-top text-sm text-muted-foreground">
      {label}
    </TableCell>
    <TableCell
      className={cn(
        "break-words py-2.5 pr-0 text-right align-top text-sm font-medium",
        className
      )}
    >
      {value}
    </TableCell>
  </TableRow>
);

export default TableRowData;
