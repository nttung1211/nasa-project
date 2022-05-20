const API_URL = 'http://localhost:5000/api/v1';

async function httpGetPlanets() {
  try {
    const response = await fetch(`${API_URL}/planets`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
    const launches = await response.json();
    return launches.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (error) {
    console.error(error);
  }
}

async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });

    return response;
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}

async function httpAbortLaunch(id) {
  try {
    const response = await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};