import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";

interface ParkingReceiptProps {
  record: {
    vehicle_number: string;
    mobile_number: string;
    entry_time: string;
    exit_time?: string;
    duration_hours?: number;
    total_fee?: number;
  };
  slotNumber: number;
}

export const ParkingReceipt = ({ record, slotNumber }: ParkingReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="p-8 shadow-xl bg-card">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success-foreground" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Payment Successful</h2>
        <p className="text-muted-foreground">Your parking session has ended</p>
      </div>

      <div className="border-t-2 border-dashed border-border my-6"></div>

      {/* Receipt Details */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-4">Railway Station Smart Parking</h3>
          <p className="text-sm text-muted-foreground">Digital Parking Receipt</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Parking Slot</span>
            <span className="font-bold text-lg text-primary">Slot {slotNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Vehicle Number</span>
            <span className="font-bold text-foreground">{record.vehicle_number}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Mobile Number</span>
            <span className="font-semibold text-foreground">{record.mobile_number}</span>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Entry Time</span>
              <span className="font-semibold text-foreground">
                {new Date(record.entry_time).toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Exit Time</span>
              <span className="font-semibold text-foreground">
                {record.exit_time && new Date(record.exit_time).toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Parking Duration</span>
              <span className="font-bold text-lg text-foreground">
                {record.duration_hours} {record.duration_hours === 1 ? 'hour' : 'hours'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rate per Hour</span>
              <span className="font-semibold text-foreground">₹10</span>
            </div>
          </div>

          <div className="border-t-2 border-primary pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">Total Amount</span>
              <span className="text-3xl font-bold text-accent">₹{record.total_fee}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Thank you for using our parking facility!</p>
          <p>Have a safe journey 🚂</p>
        </div>

        <Button
          onClick={handlePrint}
          variant="outline"
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </Card>
  );
};