import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT_EVENTS = 10;

const recentEventStore = create(
  persist(
    (set, get) => ({
      recentEventIds: [],

      addRecentEvent: (eventId) => {
        if (!eventId) return;

        set((state) => {
          const id = String(eventId);

          const filteredIds = state.recentEventIds.filter(
            (item) => String(item) !== id,
          );

          const updatedIds = [eventId, ...filteredIds];

          return {
            recentEventIds: updatedIds.slice(0, MAX_RECENT_EVENTS),
          };
        });
      },

      removeRecentEvent: (eventId) => {
        set((state) => ({
          recentEventIds: state.recentEventIds.filter(
            (item) => String(item) !== String(eventId),
          ),
        }));
      },

      clearRecentEvents: () => {
        set({
          recentEventIds: [],
        });
      },

      getRecentEventIdsString: () => {
        return get().recentEventIds.join(",");
      },
    }),
    {
      name: "swahiliexpi-recent-events",
    },
  ),
);

export default recentEventStore;
