import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { chatSlice } from './slices/chat-slice';
import { communitySlice } from './slices/community-slice';
import { messageManagingSlice } from './slices/message-managing-slice';
import { messageSlice } from './slices/message-slice';
import { socketSlice } from './slices/socket-slice';
import { Store } from './types';

enableMapSet();

export const useMergedStore = create<Store>()(
  devtools(
    immer((...args) => ({
      ...socketSlice(...args),
      ...chatSlice(...args),
      ...messageSlice(...args),
      ...messageManagingSlice(...args),
      ...communitySlice(...args),
    }))
  )
);
