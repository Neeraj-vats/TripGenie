exports.postsignup = async (data) => {
    const response = await fetch("http://localhost:2376/api/signup", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })

    const result = await response.json();
    return result;
}

exports.postLogin = async (data) => {
    const response = await fetch("http://localhost:2376/api/login", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })

    const result = await response.json();
    return result;
};

exports.logout = async () => {
    const response = await fetch("http://localhost:2376/api/logout", {
        method: "GET"
    });

    const result = await response.json();
    return result;
}

exports.email = async (data) => {
    const response = await fetch("http://localhost:2376/api/forget", {
        method: "POST",
        headers: {
            "Content-type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result = await response.json()
    return result;
};

exports.otp = async (data) => {
    const response = await fetch("http://localhost:2376/api/otp", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result = await response.json();
    return result;
};

exports.update = async (id, data) => {
    const response = await fetch(`http://localhost:2376/api/newpass/${id}`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result = await response.json();
    return result;
};