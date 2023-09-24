import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { socketSlice } from './slices/socket-slice';
import { Store } from './types';

export const useMergedStore = create<Store>()(
  devtools(
    immer((...args) => ({
      ...socketSlice(...args),
    }))
  )
);