const express = require("express");
const app = express();
const session = require("express-session");
const authServices = require("./services/authApi");
const tripServices = require("./services/tripApi");
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'tripgenie-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 din
}));

// Auth middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

app.get("/", requireLogin, async (req, res) => {
    try {
        // 1. Session se user id lekar trips mangwayein
        const trips = await tripServices.listTrips(req.session.user._id);
        
        // 2. Render karte waqt user aur trips dono bhejein
        res.render("home", { 
            user: req.session.user, 
            trips: trips || [] 
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        // Error aaye tab bhi page crash na ho, isliye khali array bhejein
        res.render("home", { user: req.session.user, trips: [] });
    }
});

app.get("/login", (req, res) => {
    res.render("login", {errors: []});
});

app.get("/signup", (req, res) => {
    res.render("signup", {errors: []});
});

app.post("/signup", async (req, res) => {
    const result = await authServices.postsignup(req.body);
    if (result.status === false) {
        res.render("signup", {errors: ["Email already registered!"]})
    } else if(result.status === true) {
        res.render("login", {errors:[]});
    } else if(result.message === 'username already exists') {
        res.render("signup", {errors: ['Username already exists']});
    }
});

app.post("/login", async (req, res) => {
    const result = await authServices.postLogin(req.body);
    
    if (result.status === false) {
        res.render('login', {errors: ["User doesn't exist!"]});
    } else if(result.status === true) {
        req.session.user = result.user;

        const trips = await tripServices.listTrips(result.user._id);
        
        res.render("home", { 
            user: result.user, 
            trips: trips || [] 
        });
    } else {
        res.render("login", {errors: ["Password Invalid"]});
    }
});

app.get("/forget", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forget.html'));
});

app.post("/forget", async (req, res) => {
    const result = await authServices.email(req.body);
    res.render('otp', {userid:result.id});
});

app.post("/otp/:id", async (req, res) => {
    const result = await authServices.otp(req.body);
    if(result.status == true) {
        res.render('updatePass', {userid: req.params.id});
    } else {
        res.sendFile(path.join(__dirname, 'public', 'otpinvalid.html'));
    }
});

app.post("/resetpass/:id", async (req, res) => {
    await authServices.update(req.params.id, req.body);
    res.render("login", {errors:[]});
});

app.post("/gettripinput", requireLogin, async (req, res) => {
    const result = await tripServices.gettripinput(req.body);
    res.render("createtrip", {user: result.user});
});

app.post("/trip", requireLogin, async (req, res) => {
    const result = await tripServices.trip(req.body);
    if (result && result.success) {
        return res.redirect(`/myplans/${encodeURIComponent(req.body.userid)}`);
    }
    return res.status(502).send(`We could not generate your plan. ${result?.error || "Unknown error"}`);
});

app.get("/myplans/:userid", requireLogin, async (req, res) => {
    try {
        const trips = await tripServices.listTrips(req.params.userid);
        res.render("myplans", { trips, userid: req.params.userid });
    } catch (e) {
        res.status(500).send("Could not load your trips.");
    }
});

app.get("/tripview/:tripId", requireLogin, async (req, res) => {
    const { userid } = req.query;
    if (!userid) return res.status(400).send("Missing userid.");
    const trip = await tripServices.getTrip(req.params.tripId, userid);
    if (!trip) return res.status(404).send("Trip not found.");
    res.render("tripdetail", { trip, userid });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = 9876;
app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
});