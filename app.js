var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var project = require('./backend/project');
var timelog = require('./backend/timelog');
var user = require('./backend/user');
var company = require('./backend/company');
var auth = require('./backend/libs/auth');
var util = require('./backend/libs/utils');

var app = express();
app.set('port', process.env.PORT || 1313);
    
app.use(cookieParser());
app.use(express.static('frontend'));
app.use(bodyParser.json({reviver:util.jsonParse}));
app.use(session(
    { secret: 'homogen cat' ,
    name: 'kaas',
    cookie: { maxAge : 3600000 },
    resave: true, 
    saveUninitialized: true})
);
//last step: init auth
auth.init(app);

//add auth.ensureAuthenticated for each Rest API
//project
app.post('/project', project.save);
app.get('/project/:projectId', project.getById);

//timelog
app.post('/timelog', timelog.save);
app.get('/timelog/:userId', timelog.getByDates);

//user
app.get('/user', user.restGetCurrent);
app.post('/user/assignment', user.restAddAssignment);

//company
app.post('/company', company.restSave);

//run application
app.listen(app.get('port'), function() {
    console.log('Homogen server is started on port: ' + app.get('port'));
});
