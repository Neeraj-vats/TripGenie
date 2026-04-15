exports.gettripinput = async (data) => {
    const response = await fetch("http://localhost:2376/api/input", {
        method: "POST", 
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result = await response.json();
    return result;
}

exports.trip = async (data) => {
    // AI trip generation can take 1-2 minutes on NIM free tier
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

    const response = await fetch("http://localhost:2376/api/generatetrip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const result = await response.json();
    return result;
};

exports.listTrips = async (userid) => {
    const response = await fetch(
        `http://localhost:2376/api/trips/${encodeURIComponent(userid)}`
    );
    const result = await response.json();
    return result.trips || [];
};

exports.getTripsAndUser = async (userid) => {
    const response = await fetch(
        `http://localhost:2376/api/trips/${encodeURIComponent(userid)}`
    );
    const result = await response.json();
    return {
        trips: result.trips || [],
        user: result.user || null,
    };
};

exports.getTrip = async (tripId, userid) => {
    const q = new URLSearchParams({ userid: String(userid) });
    const response = await fetch(
        `http://localhost:2376/api/trip/${encodeURIComponent(tripId)}?${q}`
    );
    if (!response.ok) {
        return null;
    }
    const result = await response.json();
    return result.trip || null;
};

exports.deleteTrip = async (tripId, userid) => {
    const q = new URLSearchParams({ userid: String(userid) });
    const response = await fetch(
        `http://localhost:2376/api/trip/${encodeURIComponent(tripId)}?${q}`,
        { method: "DELETE" }
    );

    const result = await response.json();
    return {
        ok: response.ok,
        ...result,
    };
};

exports.settings = async (id) => {
    const response = await fetch(`http://localhost:2376/api/settings/${id}`, {
        method: "GET"
    });

    const result = await response.json();
    return result;
}