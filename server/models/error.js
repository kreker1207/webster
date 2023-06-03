const ERROR_MAP = new Map ([
    // VVV Unexpected errors 0 - 100
    [10, {message: 'CUstoM Error: front undefined error', status: 400}],
    [0, { message: 'CUstoM Error: server undefined error', status: 500 }],
    [12, {message: 'CUstoM Error: Rename your project', status: 400}],

    // VVV Auth/user Errors 1000 - 1019
    [1001, {message: 'Login not found!', status: 400}],
    [1002, { message: 'Passwords don\'t match!', status: 400 }],
    [1003, { message: 'You need to confirm email first', status: 403 }],
    [1004, { message: 'Login already exists!', status: 400 }],
    [1005, { message: 'Email already in use', status: 400 }],
    [1006, { message: 'Organization not found by ID', status: 404 }],
    [1007, { message: 'You are not able to create event', status: 403 }],
    [1008, { message: 'You are not able to call this endpoint', status: 403 }],
    [1009, { message: 'Event not found by ID', status: 404 }],
    [1010, { message: 'Comment not found by ID', status: 404 }],
    [1011, { message: 'You need to login first!', status: 403 }],
    [1012, { message: 'No files were uploaded.', status: 400 }],
    [1013, { message: 'Promo not found!', status: 400 }],
    [1014, { message: 'User with this email not found', status: 404 }],
    [1015, { message: 'No seats left for this event!', status: 400}]
]);

class CustomError extends Error {
    constructor(errCode, addInfo = 'undefined', ...params) {
        super(...params);
        const { message, status } = ERROR_MAP.get(errCode) || ERROR_MAP.get(0);
        this.message = typeof message === 'function' ? message(additionalInfo) : message;
        // function for later: [1021, { message: (additionalInfo) => `Unallowed symbols at ${additionalInfo}`, status: 400 }],
        this.status = status;
        this.errCode = errCode;
    }
}

const errorReplier = function(error, res) {
    console.log(error);
    if(!error.status) {
        res.status(500);
        if (error.addMessage)
            res.send('Totally unexpected Error at ' + error.addMessage);
        else res.send('Totally unexpected Error!');
    }
    else res.status(error.status).send(error);
}

module.exports = {CustomError, errorReplier};
