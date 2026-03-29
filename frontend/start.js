const express = require("express");
const app = express();
const authServices = require("./services/authApi");
const tripServices = require("./services/tripApi");
const path = require("path");


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/login", (req, res, next) => {
    res.render("login", {errors: []});
});

app.get("/signup", (req, res, next) => {
    res.render("signup", {errors: []});
});

app.post("/signup", async (req, res, next) => {
    const data = req.body;
    console.log("Data is", data);
    const result = await authServices.postsignup(data);
    if (result.status === false) {
        res.render("signup", {errors: ["Email already registered!"]})
    } else if(result.status === true) {
    res.render("login", {errors:[]});
    } else if(result.message === 'username already exists') {
        res.render("signup", {errors: ['Username already exists']});
    }
});

app.post("/login", async (req, res, next) => {
    const data = req.body;
    console.log("Login data is", data);
    const result = await authServices.postLogin(data);
    console.log("Logged in successfully", result.status);
    if (result.status === false ){
        res.render('login', {errors: ["User doesn't exists!"]});
    } else if(result.status === true ) {
        console.log("user loggedin is ", result.user)
        res.render("home", {user: result.user});
    } else {
        res.render("login", {errors: ["Password Invalid"]});
    }
});

// app.get("/logout", async (req, res, next) => {
//     const result = await authServices.logout();
//     res.redirect("/");
// });

app.get("/forget", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'forget.html'));
});

app.post("/forget", async (req, res, next) => {
    const data = req.body;
    const result = await authServices.email(data);
    res.render('otp', {userid:result.id});
});

app.post("/otp/:id", async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const result = await authServices.otp(data);
    if(result.status == true ){
        res.render('updatePass', {userid: id});
    } else {
        res.sendFile(path.join(__dirname, 'public', 'otpinvalid.html'));
    }
});

app.post("/resetpass/:id", async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const result = await authServices.update(id, data);
    res.render("login", {errors:[]});
});

app.post("/gettripinput", async (req, res, next) => {
    const data = req.body;
    const result = await tripServices.gettripinput(data);
    res.render("createtrip", {user: result.user});
});

app.post("/trip", async (req, res, next) => {
    const data = req.body;
    console.log("data of trip is", data);
    const result = await tripServices.trip(data);
    if (result && result.success) {
        return res.redirect(`/myplans/${encodeURIComponent(data.userid)}`);
    }
    return res.status(502).send(
        `We could not generate your plan. ${result?.error || "Unknown error"}`
    );
});

app.get("/myplans/:userid", async (req, res, next) => {
    try {
        const trips = await tripServices.listTrips(req.params.userid);
        res.render("myplans", {
            trips,
            userid: req.params.userid,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Could not load your trips.");
    }
});

app.get("/tripview/:tripId", async (req, res, next) => {
    const { userid } = req.query;
    if (!userid) {
        return res.status(400).send("Missing userid.");
    }
    const trip = await tripServices.getTrip(req.params.tripId, userid);
    if (!trip) {
        return res.status(404).send("Trip not found.");
    }
    res.render("tripdetail", { trip, userid });
});

const PORT = 9876;
app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
});