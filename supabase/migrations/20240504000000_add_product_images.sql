-- Adiciona coluna para armazenar URLs das imagens
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Adiciona coluna para armazenar o índice da imagem de capa
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS cover_image_index INTEGER DEFAULT 0;