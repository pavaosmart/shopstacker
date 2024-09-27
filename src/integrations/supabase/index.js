// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import hooks
import {
  useProduct,
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct
} from './hooks/useProducts';

import {
  useOrder,
  useOrders,
  useAddOrder,
  useUpdateOrder,
  useDeleteOrder
} from './hooks/useOrders';

import {
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser
} from './hooks/useUsers';

import {
  usePricingSetting,
  usePricingSettings,
  useAddPricingSetting,
  useUpdatePricingSetting,
  useDeletePricingSetting
} from './hooks/usePricingSettings';

import {
  useCompetitorPrice,
  useCompetitorPrices,
  useAddCompetitorPrice,
  useUpdateCompetitorPrice,
  useDeleteCompetitorPrice
} from './hooks/useCompetitorPrices';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useProduct,
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useOrder,
  useOrders,
  useAddOrder,
  useUpdateOrder,
  useDeleteOrder,
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
  usePricingSetting,
  usePricingSettings,
  useAddPricingSetting,
  useUpdatePricingSetting,
  useDeletePricingSetting,
  useCompetitorPrice,
  useCompetitorPrices,
  useAddCompetitorPrice,
  useUpdateCompetitorPrice,
  useDeleteCompetitorPrice
};