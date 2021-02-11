const cors = require('cors');
const express = require('express')
const app = express()
const port = 3333

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'trust_our_leader',
    host: 'localhost',
    database: 'postgres',
    password: 'in_jeff_we_trust',
    port: 5432,
})

app.use(cors());
app.use(express.json());

app.get('/participation', (req, res) => {
    pool.query('SELECT * FROM participation ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
        res.send(results.rows)
    })
    // res.send([
    //     {firstname: 'One', lastname: 'Smith', percent: .20},
    //     {firstname: 'Two', lastname: 'Smith', percent: .20},
    //     {firstname: 'Three', lastname: 'Smith', percent: .20},
    // ])
})

app.post('/participation/', function(req, res) {
    console.log(`body ${JSON.stringify(req.body)}`)
    pool.query('INSERT INTO participation (firstname, lastname, hours) values ($1, $2, $3) RETURNING id', [req.body.firstname, req.body.lastname, req.body.hours], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows[0].id)
        res.send({id:results.rows[0].id})
    })
});
app.delete('/participation/:id', function(req, res) {
    const id = req.params.id
    pool.query('DELETE FROM participation WHERE id = $1 RETURNING id', [id], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows[0].id)
        res.send({id:results.rows[0].id})
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})