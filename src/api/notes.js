const BASE_URL = "http://localhost:5000";

//headers helper
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("token")
});

//common response handler
const handleResponse = async (res) => {
  if (res.status === 401) {
    // token expired / invalid
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};


//GET
export const fetchNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`, {
    headers: getAuthHeaders()
  });

  return handleResponse(res);
};


//CREATE
export const createNote = async (note) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });

  return handleResponse(res);
};


//UPDATE
export const updateNote = async (id, note) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });

  return handleResponse(res);
};


//DELETE
export const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  return handleResponse(res);
};


//ARCHIVE
export const toggleArchive = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: "PATCH",
    headers: getAuthHeaders()
  });

  return handleResponse(res);
};


//SOFT DELETE]
export const softDelete = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}/delete`, {
    method: "PATCH",
    headers: getAuthHeaders()
  });

  return handleResponse(res);
};


//RESTORE
export const restoreNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}/restore`, {
    method: "PATCH",
    headers: getAuthHeaders()
  });

  return handleResponse(res);
};