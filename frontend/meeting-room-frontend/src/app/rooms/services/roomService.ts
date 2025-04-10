export async function fetchRooms() {
    const res = await fetch('http://localhost:3000/rooms');
    if (!res.ok) {
      throw new Error('Failed to fetch rooms');
    }
    return res.json();
  }
  