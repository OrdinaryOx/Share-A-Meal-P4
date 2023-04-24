var express = require('express');
const createHttpError = require('http-errors');
var router = express.Router();
const assert = require('assert');
router.use(express.json());


//PASSWORDS LIST -> maybe remove?
var passwordMap = {};
passwordMap['j.evans@server.com'] = 'Eendenbeker12';
passwordMap['g.ernst@server.com'] = 'Gijskoektrommel1';
passwordMap['e.garm@server.com'] = '123PASS123';
passwordMap['d.crocker@server.com'] = 'Treasure1997'
passwordMap['w.poro@server.com'] = 'PoroPoro1990'



//IN MEMORY DATABASE
var results = [{
    id: 1,
    firstName: "John",
    lastName: "Evans",
    street: "Lovendijkstraat 61",
    city: "Breda",
    isActive: true,
    emailAddress: "j.evans@server.com",
    phoneNumber: "061-242-5475"
}, {
    id: 2,
    firstName: "Gijs",
    lastName: "Ernst",
    street: "Sacrementsstraat 1",
    city: "Leeuwarden",
    isActive: false,
    emailAddress: "g.ernst@server.com",
    phoneNumber: "062-948-1919"
}, {
    id: 3,
    firstName: "Elliot",
    lastName: "Garm",
    street: "Hogeschoollaan 32",
    city: "Breda",
    isActive: true,
    emailAddress: "e.garm@server.com",
    phoneNumber: "062-929-1919"
}, {
    id: 4,
    firstName: "Davy",
    lastName: "Crocker",
    street: "New York Street 12",
    city: "Breda",
    isActive: false,
    emailAddress: "d.crocker@server.com",
    phoneNumber: "062-948-1123"
}, {
    id: 5,
    firstName: "Willem",
    lastName: "Poro",
    street: "Leeuwardenstraat 19",
    city: "Leeuwarden",
    isActive: true,
    emailAddress: "w.poro@server.com",
    phoneNumber: "062-900-1919"
}]


let index = results.length;
//UC-201 Registreren als nieuwe user ----------------------------------------------------------------------------
router.post('/', (req, res) => {
    //USER
    const user = {
            id: index++,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street,
            city: req.body.city,
            isActive: req.body.isActive === undefined ? true : req.body.isActive,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        }
        //CHECK IF USER EXISTS
    const userExists = results.some(u => u.emailAddress === user.emailAddress);
    if (userExists) {
        res.status(403).json({
            status: 403,
            message: 'User with this email address already exists',
            data: {},
        });
        return;
    }
    //ASSERT
    try {
        assert(typeof user.firstName === 'string' && user.firstName.trim() !== '', 'First name must be a non-empty string');
        assert(typeof user.lastName === 'string' && user.lastName.trim() !== '', 'Last name must be a non-empty string');
        assert(typeof user.emailAddress === 'string' && validateEmail(user.emailAddress), 'Email Address must be a valid emailaddress');
        assert(typeof user.password === 'string' && validatePassword(user.password), 'Password must be a valid password')
        assert(typeof user.phoneNumber === 'string' && validatePhoneNumber(user.phoneNumber), 'Phone number must be a valid phone number');
    } catch (err) {
        //STATUS ERROR
        res.status(400).json({
            status: 400,
            message: err.message.toString(),
            data: {},
        });
        return;
    }

    //ADD EMAIL & PASSWORD COMBO TO HASHMAP
    passwordMap[req.body.emailAddress] = req.body.password;
    //SAVE USER IN RESULTS
    results.push(user);
    //DELETE PASSWORD FROM RESULTS
    results.map(user => {
        if (user.password) {
            delete user.password;
        }
    });

    //STATUS SUCCEEDED
    res.status(201).json({
        status: 201,
        message: 'User added',
        data: user,
    })
    res.end();
})

//UC-202 Opvragen overzicht van users ----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
    let filteredResults = results;

    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const emailAddress = req.query.emailAddress;
    const isActive = req.query.isActive;
    const city = req.query.city;


    // FILTERS
    if (firstName) {
        filteredResults = filteredResults.filter(user => user.firstName.toLowerCase() === firstName.toLowerCase());
    }
    if (lastName) {
        filteredResults = filteredResults.filter(user => user.lastName.toLowerCase() === lastName.toLowerCase());
    }
    if (emailAddress) {
        filteredResults = filteredResults.filter(user => user.emailAddress.toLowerCase() === emailAddress.toLowerCase());
    }
    if (isActive !== undefined) {
        const isActiveBoolean = isActive === "true";
        filteredResults = filteredResults.filter(user => user.isActive === isActiveBoolean);
    }
    if (city) {
        filteredResults = filteredResults.filter(user => user.city.toLowerCase() === city.toLowerCase());
    }

    //IF FILTERS DON'T MATCH, RETURN NOTHING
    if (!firstName && !lastName && !emailAddress && !isActive && !city && Object.keys(req.query).length !== 0) {
        filteredResults = [];
    }
    // RETURN RESULTS
    res.status(200).json({
        data: filteredResults,
    });
});


//UC-203 Opvragen van gebruikersprofiel ----------------------------------------------------------------------------
router.get('/profile', function(req, res, next) {
    res.status(200).json({
        data: results[0],
    });

    // if (!token) {
    //     res.status(401).json({
    //         status: 401,
    //         message: 'Invalid token',
    //         data: {}
    //     })
    // }
});

//UC-204 Opvragen van usergegevens bij ID ----------------------------------------------------------------------------
router.get('/:userid', function(req, res, next) {
    const userId = parseInt(req.params.userid);
    const user = results.find(user => user.id === userId);
    if (!user) {
        res.status(404).json({
            status: 404,
            message: 'user not found',
            data: []
        });
    } else {
        res.status(200).json({
            data: user,
        })
    }
});

router.put('/:userid', function(req, res, next) {
    const userId = parseInt(req.params.userid);
    const user2 = results.find(user => user.id === userId);
    if (!user2) {
        res.status(404).json({
            status: 404,
            message: 'user not found',
            data: []
        });
    }

    //GET USER
    const user = results[userId - 1];

    //ASSERTIONS
    try {
        assert(typeof req.body.firstName === 'undefined' || (typeof req.body.firstName === 'string' && req.body.firstName.trim() !== ''), 'First name must be a non-empty string');
        assert(typeof req.body.lastName === 'undefined' || (typeof req.body.lastName === 'string' && req.body.lastName.trim() !== ''), 'Last name must be a non-empty string');
        assert(typeof req.body.emailAddress === 'undefined' || (typeof req.body.emailAddress === 'string' && validateEmail(req.body.emailAddress)), 'Email Address must be a valid email address');
        assert(typeof req.body.phoneNumber === 'undefined' || (typeof req.body.phoneNumber === 'string' && validatePhoneNumber(req.body.phoneNumber)), 'Phone number must be a valid phone number');
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message.toString(),
            data: {},
        });
        return;
    }
    //UPDATE USER
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.street = req.body.street || user.street;
    user.city = req.body.city || user.city;
    user.isActive = req.body.isActive === undefined ? user.isActive : req.body.isActive;
    user.emailAddress = req.body.emailAddress || user.emailAddress;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    // //DELETE PASSWORD FROM RESULTS
    // results.map(user => {
    //     if (user.password) {
    //         delete user.password;
    //     }
    // });

    res.status(200).json({
        data: user
    });
});

//UC-206 Verwijderen van user ----------------------------------------------------------------------------
router.delete('/:userid', function(req, res, next) {
    const userId = parseInt(req.params.userid);
    const user = results.filter(user => user.id === userId);
    if (!user) {
        res.status(404).json({
            status: 404,
            message: `User with ID ${userId} not found`,
            data: {}
        })
    } else {
        results = results.filter(user => user.id !== userId);
        res.status(200).json({
            status: 200,
            message: `User with ID ${userId} has been deleted`,
            data: {}
        });
        return;
    }
})


//Validation -------------------------------------------------------------
function validateEmail(email) {
    //VALIDATES a.user@hotmail.com
    //VALIDATES user@hotmail.com
    const regex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
    return regex.test(String(email).toLowerCase());
}


function validatePassword(pass) {
    //ATLEAST 1 NUMBER
    //ATLEAST 1 UPPERCASE
    //MINIMUM LENGTH 8
    const regex = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    return regex.test(pass);
}

function validatePhoneNumber(phoneNumber) {
    //VALIDATES 061-242-5475
    const regex = /^0[1-9][0-9]{1,2}-[0-9]{3}-[0-9]{4}$/;
    return regex.test(phoneNumber);
}


module.exports = router;