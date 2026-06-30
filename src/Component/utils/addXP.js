export const addXP = (xp) => {
  const currentId =
    localStorage.getItem("currentUserId");

  const users = JSON.parse(
    localStorage.getItem("users") || "[]"
  );

  const updatedUsers = users.map((u) => {
    if (String(u.id) === String(currentId)) {
      return {
        ...u,
        xp: (u.xp || 0) + xp,
      };
    }
    return u;
  });

  localStorage.setItem(
    "users",
    JSON.stringify(updatedUsers)
  );
};