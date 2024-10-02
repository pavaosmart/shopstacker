-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create mercado_pago_settings table
CREATE TABLE public.mercado_pago_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token TEXT,
    public_key TEXT,
    client_id TEXT,
    client_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mercado_pago_transactions table
CREATE TABLE public.mercado_pago_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    external_id TEXT,
    status TEXT,
    amount DECIMAL(10, 2),
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mercado_pago_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for mercado_pago_settings
CREATE POLICY "Users can view their own Mercado Pago settings" ON public.mercado_pago_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Mercado Pago settings" ON public.mercado_pago_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Mercado Pago settings" ON public.mercado_pago_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for mercado_pago_transactions
CREATE POLICY "Users can view their own Mercado Pago transactions" ON public.mercado_pago_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Mercado Pago transactions" ON public.mercado_pago_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Mercado Pago transactions" ON public.mercado_pago_transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at column
CREATE TRIGGER update_mercado_pago_settings_updated_at
BEFORE UPDATE ON public.mercado_pago_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mercado_pago_transactions_updated_at
BEFORE UPDATE ON public.mercado_pago_transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();