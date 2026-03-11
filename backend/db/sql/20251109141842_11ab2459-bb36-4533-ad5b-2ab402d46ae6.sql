-- Create parking_slots table to track all 20 slots
CREATE TABLE public.parking_slots (
  id SERIAL PRIMARY KEY,
  slot_number INTEGER UNIQUE NOT NULL CHECK (slot_number >= 1 AND slot_number <= 20),
  is_occupied BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create parking_records table to track entry/exit
CREATE TABLE public.parking_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id INTEGER NOT NULL REFERENCES public.parking_slots(slot_number) ON DELETE CASCADE,
  mobile_number TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  exit_time TIMESTAMP WITH TIME ZONE,
  duration_hours NUMERIC(10,2),
  total_fee NUMERIC(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_records ENABLE ROW LEVEL SECURITY;

-- Public access policies (no authentication required for this parking system)
CREATE POLICY "Anyone can view parking slots" ON public.parking_slots FOR SELECT USING (true);
CREATE POLICY "Anyone can update parking slots" ON public.parking_slots FOR UPDATE USING (true);

CREATE POLICY "Anyone can view parking records" ON public.parking_records FOR SELECT USING (true);
CREATE POLICY "Anyone can insert parking records" ON public.parking_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update parking records" ON public.parking_records FOR UPDATE USING (true);

-- Insert all 20 parking slots
INSERT INTO public.parking_slots (slot_number) 
SELECT generate_series(1, 20);

-- Enable realtime for live slot updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.parking_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parking_records;