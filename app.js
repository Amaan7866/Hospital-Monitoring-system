const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

const adminUsername = "admin";
const adminPassword = "admin";

const hospitalsData = {
  chennai: [],
  bangalore: [],
  lucknow: [],
  delhi: [],
  kochi: [],
};

// Show all cities
app.get("/", (req, res) => {
  res.render("home", { cities: Object.keys(hospitalsData) });
});

// Hospitals by city
app.get("/city/:cityName", (req, res) => {
  const cityName = req.params.cityName;
  const hospitals = hospitalsData[cityName] || [];
  res.render("city", { cityName, hospitals });
});

// Add hospital form
app.get("/city/:cityName/add", (req, res) => {
  const cityName = req.params.cityName;
  res.render("addHospital", { cityName });
});

app.get("/landing", (req, res) => {
  res.render("landing");
});

// Handle form submission to add a hospital
app.post("/city/:cityName/add", (req, res) => {
  const cityName = req.params.cityName;
  const { name, address, contact, vacantBeds } = req.body;

  const newHospital = { name, address, contact, vacantBeds };
  hospitalsData[cityName].push(newHospital);

  res.redirect(`/city/${cityName}`);
});

// Hospital details page
app.get("/city/:cityName/hospital/:hospitalName", (req, res) => {
  const cityName = req.params.cityName;
  const hospitalName = req.params.hospitalName;

  const hospitalsInCity = hospitalsData[cityName];
  const hospital = hospitalsInCity.find((h) => h.name === hospitalName);

  if (hospital) {
    res.render("hospitalDetails", { cityName, hospital });
  } else {
    res.status(404).send("Hospital not found");
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simple check for admin credentials (you can replace this with more secure authentication)
  if (username === "admin" && password === "admin") {
    res.redirect("/");
  } else {
    res.status(401).send("Invalid credentials");
  }
});
// Handle form submission to update vacant beds
app.post("/city/:cityName/hospital/:hospitalName/update", (req, res) => {
  const cityName = req.params.cityName;
  const hospitalName = req.params.hospitalName;
  const { vacantBeds } = req.body;

  const hospitalsInCity = hospitalsData[cityName];
  const hospital = hospitalsInCity.find((h) => h.name === hospitalName);

  if (hospital) {
    hospital.vacantBeds = vacantBeds;
    res.redirect(
      `/city/${cityName}/hospital/${encodeURIComponent(hospitalName)}`
    );
  } else {
    res.status(404).send("Hospital not found");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
