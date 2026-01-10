import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface AmortizationEntry {
  month: number;
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AmortizationScheduleProps {
  data: AmortizationEntry[];
}

const ITEMS_PER_PAGE = 12;

const AmortizationSchedule = ({ data }: AmortizationScheduleProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <section className="table-container" aria-labelledby="schedule-heading">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 id="schedule-heading" className="text-lg font-semibold">Amortization Schedule</h3>
        
        <nav className="flex items-center gap-2" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Interest</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((entry) => (
              <TableRow key={entry.month}>
                <TableCell className="font-medium">{entry.month}</TableCell>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell className="text-right">{formatCurrency(entry.payment)}</TableCell>
                <TableCell className="text-right text-chart-primary font-medium">
                  {formatCurrency(entry.principal)}
                </TableCell>
                <TableCell className="text-right text-chart-secondary">
                  {formatCurrency(entry.interest)}
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(entry.balance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Year Summary */}
      <div className="p-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing payments {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length} total payments
        </p>
      </div>
    </section>
  );
};

export default AmortizationSchedule;
