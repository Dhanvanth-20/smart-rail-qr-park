import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { ParkingReceipt } from "@/components/ParkingReceipt";

interface ParkingRecord {
  id: string;
  mobile_number: string;
  vehicle_number: string;
  entry_time: string;
  exit_time?: string;
  duration_hours?: number;
  total_fee?: number;
  status: string;
}

const SlotDetail = () => {
  const { slotNumber } = useParams<{ slotNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isOccupied, setIsOccupied] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeRecord, setActiveRecord] = useState<ParkingRecord | null>(null);
  const [completedRecord, setCompletedRecord] = useState<ParkingRecord | null>(null);

  useEffect(() => {
    if (slotNumber) {
      fetchSlotStatus();
    }
  }, [slotNumber]);

  const fetchSlotStatus = async () => {
    try {
      // Check if slot is occupied
      const { data: slotData, error: slotError } = await supabase
        .from('parking_slots')
        .select('is_occupied')
        .eq('slot_number', Number(slotNumber))
        .single();

      if (slotError) throw slotError;
      setIsOccupied(slotData.is_occupied);

      // If occupied, fetch active record
      if (slotData.is_occupied) {
        const { data: recordData, error: recordError } = await supabase
          .from('parking_records')
          .select('*')
          .eq('slot_id', Number(slotNumber))
          .eq('status', 'active')
          .order('entry_time', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recordError) throw recordError;
        setActiveRecord(recordData);
      }
    } catch (error) {
      console.error('Error fetching slot status:', error);
      toast({
        title: "Error",
        description: "Failed to load slot information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || !vehicleNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create parking record
      const { error: insertError } = await supabase
        .from('parking_records')
        .insert({
          slot_id: Number(slotNumber),
          mobile_number: mobileNumber,
          vehicle_number: vehicleNumber.toUpperCase(),
          status: 'active'
        });

      if (insertError) throw insertError;

      // Update slot status
      const { error: updateError } = await supabase
        .from('parking_slots')
        .update({ is_occupied: true })
        .eq('slot_number', Number(slotNumber));

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: `Vehicle ${vehicleNumber.toUpperCase()} parked at Slot ${slotNumber}`,
      });

      // Navigate back to home
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error during entry:', error);
      toast({
        title: "Error",
        description: "Failed to register parking entry",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExit = async () => {
    if (!activeRecord) return;

    setSubmitting(true);
    try {
      const exitTime = new Date();
      const entryTime = new Date(activeRecord.entry_time);
      const durationMs = exitTime.getTime() - entryTime.getTime();
      const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to nearest hour
      const totalFee = durationHours * 10;

      // Update parking record
      const { error: updateRecordError } = await supabase
        .from('parking_records')
        .update({
          exit_time: exitTime.toISOString(),
          duration_hours: durationHours,
          total_fee: totalFee,
          status: 'completed'
        })
        .eq('id', activeRecord.id);

      if (updateRecordError) throw updateRecordError;

      // Update slot status
      const { error: updateSlotError } = await supabase
        .from('parking_slots')
        .update({ is_occupied: false })
        .eq('slot_number', Number(slotNumber));

      if (updateSlotError) throw updateSlotError;

      // Set completed record for receipt display
      setCompletedRecord({
        ...activeRecord,
        exit_time: exitTime.toISOString(),
        duration_hours: durationHours,
        total_fee: totalFee,
        status: 'completed'
      });

      toast({
        title: "Exit Successful",
        description: "Your parking bill has been generated",
      });
    } catch (error) {
      console.error('Error during exit:', error);
      toast({
        title: "Error",
        description: "Failed to process exit",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show receipt if exit was just completed
  if (completedRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Parking Grid
          </Button>
          <ParkingReceipt record={completedRecord} slotNumber={Number(slotNumber)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Parking Grid
        </Button>

        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚗</div>
            <h1 className="text-3xl font-bold text-foreground">Parking Slot {slotNumber}</h1>
            <p className="text-muted-foreground mt-2">
              {isOccupied ? 'Vehicle Exit' : 'Vehicle Entry'}
            </p>
          </div>

          {!isOccupied ? (
            // Entry Form
            <form onSubmit={handleEntry} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Registration Number</Label>
                <Input
                  id="vehicle"
                  type="text"
                  placeholder="e.g., TN-09-AB-4321"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  required
                  className="text-lg uppercase"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-success hover:bg-success/90 text-lg py-6"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Confirm Entry
                  </>
                )}
              </Button>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-center font-semibold text-accent">
                  Parking Fee: ₹10 per hour
                </p>
              </div>
            </form>
          ) : activeRecord ? (
            // Exit View
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Number</p>
                  <p className="text-xl font-bold text-foreground">{activeRecord.vehicle_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="text-lg font-semibold text-foreground">{activeRecord.mobile_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entry Time</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(activeRecord.entry_time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleExit}
                className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Exit...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Process Exit & Generate Bill
                  </>
                )}
              </Button>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-center font-semibold text-accent">
                  Fee will be calculated at ₹10 per hour (rounded up)
                </p>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default SlotDetail;