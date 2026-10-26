
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(
    path.join(__dirname, 'db.json')
);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Generate sequential numeric IDs for new expenses
server.use('/expenses', (req, res, next) => {
    if (req.method === 'POST') {
        const expenses = router.db.get('expenses').value();

        const highestId = expenses.reduce((max, expense) => {
            const id = Number(expense.id);

            return Number.isSafeInteger(id) && id > max
                ? id
                : max;
        }, 0);

        req.body.id = highestId + 1;
    }

    next();
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server running at http://localhost:3000');
});
