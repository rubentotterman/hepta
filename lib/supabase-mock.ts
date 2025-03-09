export const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: async () => ({
        data: {
          session: null,
        },
        error: null,
      }),
      signInWithOAuth: async () => ({
        data: null,
        error: null,
      }),
      signOut: async () => ({
        error: null,
      }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: null,
          }),
        }),
      }),
      insert: async () => ({
        data: null,
        error: null,
      }),
      update: async () => ({
        data: null,
        error: null,
      }),
    }),
  }
}

