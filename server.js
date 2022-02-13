// **** PHASE ZERO: SETTING UP DATABASE CONNECTION & SEEDING **** // 

const Sequelize = require('sequelize');// this brings in sequelize to my environment
const sequelize = new Sequelize('postgres://localhost/monopoly_props') // this connects to my database 'monopoly_props'. to connect I need to create a Sequelize instance.

// i need to define my variable in the gobal scope in order for them to be called later
    // here i am defining my table(s) and their property params
const Properties = sequelize.define('properties', {
    name: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull:false
    }
})

const ColorGroup = sequelize.define('colorGroups', {
    color: {
        type: Sequelize.STRING,
        allowNull: false
    },
    props: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})
// here I create the relationship associations
Properties.belongsTo(ColorGroup);
//ColorGroup.hasMany(Properties);

// now I am setting up my stating function to test whether i am connected
    // also i need to load my tables with data using .create() in an object form
const setUp = async () => { //  using async/await since we want it to connect to db asynchronously
    try {
        await sequelize.sync({force:true}) // this syncs and recreates my tables when I update them
        console.log('Connecteed to db!');
        // becuase "Properties" belong to -> "ColorGroup" i need to define color as a variable first to have properties call color"
        const brown = await ColorGroup.create({color: "Brown", props: 2});
        const lightBlue = await ColorGroup.create({color: "Light Blue", props: 3});
        const pink = await ColorGroup.create({color: "Pink", props: 3});
        const orange = await ColorGroup.create({color: "Orange", props: 3});
        const red = await ColorGroup.create({color: "Red", props: 2});
        const yellow = await ColorGroup.create({color: "Yellow", props: 3});
        const green = await ColorGroup.create({color: "Green", props: 3});
        const darkBlue = await ColorGroup.create({color: "Dark Blue", props: 2});
        const black = await ColorGroup.create({color: "Black", props: 4});
        const white = await ColorGroup.create({color: "White", props: 2});

        // since properties belong to color groups, here i include the colorgroup Id to each property

        await Properties.create({name: "Mediterranean Avenue", price: 60, colorGroupId: brown.id});
        await Properties.create({name: "Baltic Avenue", price: 60});
        await Properties.create({name: "Oriental Avenue", price: 100});
        await Properties.create({name: "Vermont Avenue", price: 100});
        await Properties.create({name: "Connecticut Avenue", price: 120});
        await Properties.create({name: "St. Charles Place", price: 140});
        await Properties.create({name: "States Avenue", price: 140});
        await Properties.create({name: "Virgina Avenue", price: 160});
        await Properties.create({name: "St. James Place", price: 180});
        await Properties.create({name: "Tennessee Avenue", price: 180});
        await Properties.create({name: "New York Avenue", price: 200});
        await Properties.create({name: "Kentucky Avenue", price: 220});
        await Properties.create({name: "Indina Avenue", price: 220});
        await Properties.create({name: "Illinois Avenue", price: 240});
        await Properties.create({name: "Atlantic Avenue", price: 260});
        await Properties.create({name: "Ventnor Avenue", price: 260});
        await Properties.create({name: "Marvin Gardens", price: 280});
        await Properties.create({name: "Pacific Avenue", price: 300});
        await Properties.create({name: "North Carolina Avenue", price: 300});
        await Properties.create({name: "Pennsylvania Avenue", price: 320});
        await Properties.create({name: "Park Place", price: 350});
        await Properties.create({name: "Board Walk", price: 400});

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

app.get('/', (req, res) => res.redirect('/properties'));