import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrainFront } from "lucide-react";

interface ParkingSlot {
  id: number;
  slot_number: number;
  is_occupied: boolean;
}

const Index = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('parking-slots-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_slots'
        },
        () => {
          fetchSlots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('parking_slots')
        .select('*')
        .order('slot_number');

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slotNumber: number) => {
    navigate(`/slot/${slotNumber}`);
  };

  const availableCount = slots.filter(s => !s.is_occupied).length;
  const occupiedCount = slots.filter(s => s.is_occupied).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <TrainFront className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Railway Station Smart Parking</h1>
          </div>
          <p className="text-center mt-2 text-primary-foreground/80 text-sm md:text-base">
            QR-Enabled Intelligent Parking System
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card shadow-lg border-2">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Total Slots</p>
              <p className="text-4xl font-bold text-primary">20</p>
            </div>
          </Card>
          <Card className="p-6 bg-card shadow-lg border-2 border-success/30">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Available</p>
              <p className="text-4xl font-bold text-success">{availableCount}</p>
            </div>
          </Card>
          <Card className="p-6 bg-card shadow-lg border-2 border-destructive/30">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Occupied</p>
              <p className="text-4xl font-bold text-destructive">{occupiedCount}</p>
            </div>
          </Card>
        </div>

        {/* Parking Grid */}
        <Card className="p-6 bg-card shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            Select a Parking Slot
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot.slot_number)}
                className={`
                  relative p-6 rounded-xl border-3 font-bold text-lg
                  transition-all duration-300 transform hover:scale-105
                  ${slot.is_occupied 
                    ? 'bg-destructive/10 border-destructive text-destructive cursor-not-allowed' 
                    : 'bg-success/10 border-success text-success hover:shadow-lg hover:border-success/80'
                  }
                `}
                disabled={slot.is_occupied}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🚗</div>
                  <div className="text-xl font-bold">Slot {slot.slot_number}</div>
                  <Badge 
                    variant={slot.is_occupied ? "destructive" : "default"}
                    className={`mt-2 ${!slot.is_occupied ? 'bg-success hover:bg-success' : ''}`}
                  >
                    {slot.is_occupied ? 'Occupied' : 'Available'}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-card shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-foreground">How to Use</h3>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
              <span>Select an available parking slot (green)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
              <span>Enter your mobile number and vehicle registration number</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
              <span>When you return, scan the same QR code to exit and get your bill</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">₹</span>
              <span className="font-semibold text-accent">Parking Fee: ₹10 per hour</span>
            </li>
          </ol>
        </Card>
      </main>
    </div>
  );
};

export default Index;