const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 5197;

app.use(session({secret: '`J[2|h^!$#15P-]]htrNE}okGS3.uE\'=)`&;q+:Qt}p;b">v)*dACS=k$~6r2(/h^"({f~'}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/find', (req, res) => {

    let type = req.query.type,
        specificBreed = req.query.specificBreed,
        breed = req.query.breed,
        specificAge = req.query.specificAge,
        age = req.query.age,
        gender = req.query.gender,
        dogs = req.query.dogs,
        cats = req.query.cats,
        children = req.query.children;

    if (!type || !breed || (!specificBreed && breed == 'Other') || !age || (!specificAge && age == 'Other') || !gender) {
        res.render(path.join(__dirname, 'find.ejs'), {
            display: false,
            critters: null,
            crittersToDisplay: null,
            prevInput: {}
        });
    }
    else {
        fs.readFile(path.join(__dirname, 'critters.txt'), (err, data) => {
            if (err) console.log(err);

            let specifications = [type, (breed == 'Unknown' ? 'Unknown' : specificBreed), (age == 'Unknown' ? 'Unknown' : specificAge), gender, Boolean(dogs), Boolean(cats), Boolean(children)];
            let toDisplay = [];
            data = data.toString().split('\n');

            for (let i = 0; i < data.length; i++) {
                data[i] = data[i].split(':');
                if ((specifications[0] == 'Unknown' || specifications[0] == data[i][3]) &&
                    (specifications[1] == 'Unknown' || specifications[1] == data[i][4]) &&
                    (specifications[2] == 'Unknown' || specifications[2] == data[i][5]) &&
                    (specifications[3] == 'Unknown' || specifications[3] == data[i][6]) &&
                    (!specifications[4] || data[i][7] == 'true') &&
                    (!specifications[5] || data[i][8] == 'true') &&
                    (!specifications[6] || data[i][9] == 'true')) {
                    
                    toDisplay.push(i);
                }
            }

            res.render(path.join(__dirname, 'find.ejs'), {
                display: true,
                critters: data,
                crittersToDisplay: toDisplay,
                prevInput: req.query
            });
        });
    }
});

app.get('/give', (req, res) => {
    if (!req.session.username) {
        res.render(path.join(__dirname, 'give.ejs'), {error: true, message: 'Please login before submitting the form!', prevInput: {}});
    }
    else {
        res.render(path.join(__dirname, 'give.ejs'), {error: true, message: '', prevInput: {}});
    }
});

app.post('/give', (req, res) => {
    if (!req.session.username) {
        res.render(path.join(__dirname, 'give.ejs'), {error: true, message: 'Please login before submitting the form!', prevInput: req.body});
    }
    else {
        fs.readFile(path.join(__dirname, 'numberOfCritters.txt'), (err, data) => {
            if (err) console.log(err);
            data = Number(data.toString());

            fs.appendFile(path.join(__dirname, 'critters.txt'),
            `\n${data}:${req.session.username}:${req.body.critterName ? req.body.critterName : 'Unknown'}` + 
            `:${req.body.type ? req.body.type : 'Unknown'}:${req.body.breed == 'Other' ? req.body.specificBreed : 'Unknown'}` +
            `:${req.body.age == 'Other' ? req.body.specificAge : 'Unknown'}:${req.body.gender ? req.body.gender : 'Unknown'}` +
            `:${req.body.dogs == 'true'}:${req.body.cats == 'true'}:${req.body.children == 'true'}:false` +
            `:${req.body.firstName ? req.body.firstName : 'Unknown'}:${req.body.lastName ? req.body.lastName : 'Unknown'}` +
            `:${req.body.email ? req.body.email : 'Unknown'}:${req.body.description ? req.body.description : 'Unknown'}`, (err) => {
                if (err) console.log(err);
            });
            fs.appendFile(path.join(__dirname, 'public/images/images.txt'), '\n', (err) => {
                if (err) console.log(err);
            });
            fs.writeFile(path.join(__dirname, 'numberOfCritters.txt'), String(data + 1), {}, (err) => {
                if (err) console.log(err);
            });

            res.render(path.join(__dirname, 'give.ejs'), {error: false, message: 'Critter has been successfully uploaded!', prevInput: {}});
        });
    }
});

app.get('/log', (req, res) => {
    if (req.session.username) {
        res.render(path.join(__dirname, 'logout.ejs'), {username: req.session.username});
    }
    else {
        res.render(path.join(__dirname, 'login.ejs'), {
            login: {username: '', error: true, message: ''},
            create: {username: '', error: true, message: ''}
        });
    }
});

app.post('/login', (req, res) => {
    fs.readFile(path.join(__dirname, 'login.txt'), (err, data) => {
        if (err) console.log(err);

        let valid = false;
        data = data.toString().split('\n');

        for (let i = 0; i < data.length; i++) {
            let pair = data[i].split(':');
            if (req.body.username == pair[0] && req.body.password == pair[1]) {
                valid = true;
                break;
            }
        }

        if (valid) {
            req.session.username = req.body.username;
            res.render(path.join(__dirname, 'logout.ejs'), {username: req.body.username});
        }
        else {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: req.body.username, error: true, message: 'Incorrect username or password!'},
                create: {username: '', error: true, message: ''}
            });
        }
    });
});

app.post('/create', (req, res) => {
    fs.readFile(path.join(__dirname, 'login.txt'), (err, data) => {
        if (err) console.log(err);

        let taken = false;
        data = data.toString().split('\n');

        for (let i = 0; i < data.length; i++) {
            let pair = data[i].split(':');
            if (req.body.username == pair[0]) {
                taken = true;
                break;
            }
        }

        if (!req.body.username.length) {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: true, message: ''},
                create: {username: req.body.username, error: true, message: 'Please enter your username!'}
            });
        }
        else if (taken) {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: true, message: ''},
                create: {username: req.body.username, error: true, message: 'Username has already been taken: please select another one!'}
            });
        }
        else if (!(/^[a-zA-Z0-9]*$/.test(req.body.username))) {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: true, message: ''},
                create: {username: req.body.username, error: true, message: 'Username must only contain digits and letters!'}
            });
        }
        else if (req.body.password.length < 4) {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: true, message: ''},
                create: {username: req.body.username, error: true, message: 'Password must be at least 4 characters long!'}
            });
        }
        else if (!(/^[a-zA-Z0-9]*$/.test(req.body.password))) {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: true, message: ''},
                create: {username: req.body.username, error: true, message: 'Password must only contain digits and letters!'}
            });
        }
        else if (!(/[a-zA-Z]/.test(req.body.password) && /\d/.test(req.body.password))) {
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: true, message: ''},
                create: {username: req.body.username, error: true, message: 'Password must contain at least 1 digit and at least 1 letter!'}
            });
        }
        else {
            fs.appendFile(path.join(__dirname, 'login.txt'), '\n' + req.body.username + ':' + req.body.password, (err) => {
                if (err) console.log(err);
            });
            res.render(path.join(__dirname, 'login.ejs'), {
                login: {username: '', error: false, message: ''},
                create: {username: '', error: false, message: 'Account has been created!'}
            });
        }
    });
});

app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
    }
    res.render(path.join(__dirname, 'login.ejs'), {
        login: {username: '', error: false, message: 'You have successfully logged out!'},
        create: {username: '', error: false, message: ''}
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, function(err) {
    if (err) console.log(err);
    console.log('Server listening on PORT:', PORT);
});