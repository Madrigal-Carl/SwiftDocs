import { create } from "zustand";
import { getAccountById } from "../services/account_service";

export const useProfileStore = create((set, get) => ({
  profileId: null,

  profile: {
    id: null,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "",
    createdAt: "",
    status: "",
  },

  loading: false,

  loadProfile: async (id) => {
    try {
      set({ loading: true, profileId: id });

      const data = await getAccountById(id);

      set({
        profile: {
          id: data.id,
          firstName: data.first_name || "",
          middleName: data.middle_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          role: data.role || "",
          createdAt: data.created_at || "",
          status: data.status || "",
        },
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      set({ loading: false });
    }
  },

  reloadProfile: async () => {
    const id = get().profileId;
    if (!id) return;

    await get().loadProfile(id);
  },
}));
