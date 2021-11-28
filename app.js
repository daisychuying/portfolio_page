const express = require('express');
const { projects } = require('./data.json');
const path = require('path');

const app = express();
//view engine setup
app.set('view engine', 'pug');
//Add static middleware
app.use('/static', express.static('public'));
//set route to home page
app.get('/', (req, res) => {
    res.render('index', { projects });
});
//set route to about page
app.get('/about', (req, res) => {
    res.render('about');
});
//set dynamic project route based on project's id
app.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    const projectToShow = projects[id];
    if (projectToShow){
        res.render('project', { projectToShow });
    } else {
        res.sendStatus(404);
    }
})
//handle 404 error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = 'Page Not Found.';
    console.log('404 error handler called');
    //pass error to global error handler
    next(err);
})
//Global error handler
app.use((err, req, res, next) => {

    if (err.status == 404) {
        res.status(404);
        res.render('page-not-found', { err });
    } else {
        err.message = err.message || 'Something went wrong on the server.';
        res.status(err.status || 500);
        console.log('Global error handler called', err);
        res.render('error', { err });
    }
})

//listen on port 3000
app.listen(process.env.PORT || 3000, () => {
    console.log('The app is running on localhose:3000');
})