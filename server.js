// **** PHASE ZERO: SETTING UP DATABASE CONNECTION & SEEDING **** // 

const Sequelize = require('sequelize');// this brings in sequelize to my environment
const sequelize = new Sequelize('postgres://localhost/monopoly_props') // this connects to my database 'monopoly_props'. to connect I need to create a Sequelize instance.

// i need to define my variable in the gobal scope in order for them to be called later
    // here i am defining my table(s) and their property params
const Properties = sequelize.define('properties', {
    name: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true},
    price: {
        type: Sequelize.INTEGER,
        allowNull:false}
    })

const Colors = sequelize.define('color', {
    name: {
        type: Sequelize.STRING,
        allowNull: false},
    props: {
        type: Sequelize.INTEGER,
        allowNull: false}
    })
// here I create the relationship associations
Properties.belongsTo(Colors);
Colors.hasMany(Properties);

// now I am setting up my stating function to test whether i am connected
    // also i need to load my tables with data using .create() in an object form
const setUp = async () => { //  using async/await since we want it to connect to db asynchronously
    try {  // try-catch is for error handleing (not necessary for program to run but encouraged)
        await sequelize.sync({force:true}) // this syncs and recreates my tables when I update them
        console.log('Connecteed to db!');
        // becuase "Properties" belong to -> "ColorGroup" i need to define color as a variable first to have properties call color"
        const brown = await Colors.create({name: "Brown", props: 2});
        const lightBlue = await Colors.create({name: "Light Blue", props: 3});
        const pink = await Colors.create({name: "Pink", props: 3});
        const orange = await Colors.create({name: "Orange", props: 3});
        const red = await Colors.create({name: "Red", props: 2});
        const yellow = await Colors.create({name: "Yellow", props: 3});
        const green = await Colors.create({name: "Green", props: 3});
        const darkBlue = await Colors.create({name: "Dark Blue", props: 2});
        const black = await Colors.create({name: "Black", props: 4});
        const white = await Colors.create({name: "White", props: 2});

        // since properties belong to color groups, here i include the color Id to each property

        await Properties.create({name: "Mediterranean Avenue", price: 60, colorId: brown.id});
        await Properties.create({name: "Baltic Avenue", price: 60, colorId: brown.id});
        await Properties.create({name: "Oriental Avenue", price: 100, colorId: lightBlue.id});
        await Properties.create({name: "Vermont Avenue", price: 100, colorId: lightBlue.id});
        await Properties.create({name: "Connecticut Avenue", price: 120, colorId: lightBlue.id});
        await Properties.create({name: "St. Charles Place", price: 140, colorId: pink.id});
        await Properties.create({name: "States Avenue", price: 140, colorId: pink.id});
        await Properties.create({name: "Virgina Avenue", price: 160, colorId: pink.id});
        await Properties.create({name: "St. James Place", price: 180, colorId: orange.id});
        await Properties.create({name: "Tennessee Avenue", price: 180, colorId: orange.id});
        await Properties.create({name: "New York Avenue", price: 200, colorId: orange.id});
        await Properties.create({name: "Kentucky Avenue", price: 220, colorId: red.id});
        await Properties.create({name: "Indina Avenue", price: 220, colorId: red.id});
        await Properties.create({name: "Illinois Avenue", price: 240, colorId: red.id});
        await Properties.create({name: "Atlantic Avenue", price: 260, colorId: yellow.id});
        await Properties.create({name: "Ventnor Avenue", price: 260, colorId: yellow.id});
        await Properties.create({name: "Marvin Gardens", price: 280, colorId: yellow.id});
        await Properties.create({name: "Pacific Avenue", price: 300, colorId: green.id});
        await Properties.create({name: "North Carolina Avenue", price: 300, colorId: green.id});
        await Properties.create({name: "Pennsylvania Avenue", price: 320, colorId: green.id});
        await Properties.create({name: "Park Place", price: 350, colorId: darkBlue.id});
        await Properties.create({name: "Board Walk", price: 400, colorId: darkBlue.id});
        await Properties.create({name: "Reading Railroad", price: 200, colorId: black.id});
        await Properties.create({name: "Pennsylvania Railroad", price: 200, colorId: black.id});
        await Properties.create({name: "B&O Railroad", price: 200, colorId: black.id});
        await Properties.create({name: "Shortline Railroad", price: 200, colorId: black.id});
        await Properties.create({name: "Electric Company", price: 150, colorId: white.id});
        await Properties.create({name: "Water Works", price: 150, colorId: white.id});

        //although this is part of phase 0, I connect to a port here:
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`Listening on port ${port}...`));

    
    } 
    catch (error) {
        console.log(error)
    }

}
// must create an instance of my 'setUp' function to test whether i am connected (make sure the db is created. will log error if not)
setUp();

// **** PHASE ONE: SETTING UP EXPRESS ENVIRONMENT  **** // 
const express = require('express');
const app = express();
app.use(express.urlencoded({extended:false}))
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
app.get('/', (req, res) => res.redirect('/properties')); // here i am redirecting the 'home page' to be where properties are going to be listed


app.get('/properties', async (req,res,next) => { // here i am setting up the environment to get the 'monopoly properties' from my database
    try {
        const properties = await Properties.findAll({include: [Colors]});
        const colors = await Colors.findAll();
        const propNames = properties.map(property => {
            return `<div>
                        ${property.name}  <a href = "/colors/${property.colorId}"> ${property.color.name} </a>
                    <div>`}).join('');
        res.send(`
        <html>
        <head>
          <title>Classic Monopoly Properties </title>
        <head>
        <body>
          <h1> Classic Monopoly Properties </h1>
          <h2> Add Your Own Property!</h2>
          <form method="POST">
            <input name= "name" placeholder = "Your Property's Name"/>
            <select name ="colorId">
            ${
                colors.map(color =>{
                    return `
                    <option value ="${color.id}"> ${color.name}</option>`
                }).join('')
            }
            </select>
            <input name= "price" placeholder = "Your Property's Price"/>
            <button>Add Property</button>
        </form>
          ${propNames}
         
        </body>
        </html>`)
    } catch (error) {
        
    }
})

app.get('/colors/:id', async(req, res, next) => {
    try {
        const colors = await Colors.findByPk (req.params.id, {include: [Properties]});
        const html = colors.properties.map(property => {
            return `
            <div>
    
            ${property.name} $${property.price}
            <form method="POST" action="/properties/${property.id}?_method=delete"><button>X</button></form> 
            </div>`
        }).join('');
        res.send(`<html>
            <head>
              <title>Property Colors</title>
            </head>
            <body>
              <h1> Property Colors </h1>
              <h2> ${colors.name} </h2>
              <a href ='/'> << back to full properties list  </a>
              
              ${html}
              
              
            </body>
            </html>`)

    } catch (error) {
        next(error)
    }
})

app.post('/properties', async (req, res, next) => {
    try {
        const property = await Properties.create(req.body);
        res.redirect(`/colors/${property.colorId}`)
    } catch (error) {
        next(error)
    }
})

app.delete('/properties/:id', async (req, res, next) => {
    try {
        const property = await Properties.findByPk(req.params.id);
       await property.destroy();
        res.redirect(`/colors/${property.colorId}`)
    } catch (error) {
        next(error)
    }
})