const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log('API: BASE_URL configured as:', BASE_URL);

//headers helper
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("token")
});

//Test connection
export const testConnection = async () => {
  try {
    const res = await fetch(`${BASE_URL}/test`);
    const data = await res.json();
    console.log('Test connection response:', data);
    return data;
  } catch (err) {
    console.error('Test connection error:', err);
    throw err;
  }
};

//common response handler
const handleResponse = async (res) => {
  if (res.status === 401) {
    // token expired / invalid
    console.error('API: 401 Unauthorized - Token invalid or expired');
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    console.error('API: Response not OK', {
      status: res.status,
      error: data.error
    });
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
  console.log('API: Creating note', note);
  const headers = getAuthHeaders();
  console.log('API: Auth header Authorization:', headers.Authorization ? 'present' : 'missing');
  
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(note),
  });

  console.log('API: Response status:', res.status);
  console.log('API: Response headers:', res.headers);
  
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