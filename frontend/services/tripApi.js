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
    const response = await fetch("http://localhost:2376/api/generatetrip", {
        method: "POST", 
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result = await response.json();
    return result;
}