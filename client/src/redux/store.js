import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ user: userReducer });

// error/loading are transient UI state, not something a user's session
// should carry across page loads -- without this, a failed sign-in
// attempt would show "Wrong credentials!" forever on every future visit
// to the page, since redux-persist would keep restoring the stale value.
const stripTransientState = (state) => {
  // eslint-disable-next-line no-unused-vars
  const { error, loading, ...rest } = state;
  return rest;
};

const stripTransientUserState = createTransform(
  stripTransientState,
  // Also strip on rehydrate, so a browser that already has a stale
  // error/loading saved from before this fix self-heals on next load
  // instead of needing localStorage cleared by hand.
  stripTransientState,
  { whitelist: ['user'] }
);

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  transforms: [stripTransientUserState],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
