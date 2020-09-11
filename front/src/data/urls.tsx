const urls = {
  root: "/",
  rooms: {
    base: "/rooms",
    object: (id: number): string => (id ? `/rooms/${id}` : "/rooms/:id"),
  },
  games: {
    base: "/games",
  },
};

export default urls;
