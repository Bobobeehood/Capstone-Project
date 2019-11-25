const db = require('../db/index');


exports.getClass = (req, res) => {
    db.connect((err, client, done) => {
        const query = 'SELECT * FROM classes';
        client.query(query, (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            }
            if (result.rows < '1') {
                res.status(404).send({
                    status: 'error',
                    error: 'Not found',
                });
            } else {
                res.status(200).send({
                    status: 'success',
                    data: result.rows,
                });
            }
        });
    });
};

exports.classClass = (req, res) => {
    // eslint-disable-next-line radix
    const classId = parseInt(req.params.id);
    const title = req.body.title;
    const description = req.body.description;
    const createdOn = req.body.createdOn;

    db.connect((err, client, done) => {
        const query = 'INSERT INTO classes(classId, title, description, createdOn) VALUES($1,$2,$3, $4) RETURNING *';
        const values = [ classId, title, description, createdOn ];
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'Please check the query',
                });
            } else {
                const message = 'Class created successfully';
                Object.assign(result.rows[0], { message });
                res.status(202).send({
                    status: 'success',
                    data: result.rows[0],
                });
            }
        });
    });
};



exports.getClassById = (req, res) => {
    // eslint-disable-next-line radix
    const classId = parseInt(req.params.id);
    db.connect((err, db, done) => {
        const query = 'SELECT classId, title, description, createdon FROM classs WHERE classId = $1';
        db.query(query, [classId], (error, result) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'There is no class with such Id!',
                });
            }
            if (result.rows < '1') {
                res.status(404).send({
                    status: 'error',
                    error: 'class with that id was not found',
                });
            } else {
                const query1 = 'SELECT classId, title, description FROM classes WHERE classId = $1';
                db.query(query1, [classId])
                    .then((data) => {
                        const comments = data.rows[0];
                        Object.assign(result.rows[0], { comments });
                        res.status(200).send({
                            status: 'success',
                            data: result.rows,
                        });
                        // eslint-disable-next-line no-console
                    }).catch((e) => console.log(e));
            }
        });
    });
  };

  exports.deleteClass = (req, res) => {
    // eslint-disable-next-line radix
    const classId = parseInt(req.params.id);
    db.connect((er, client, done) => {
        const query = 'DELETE from classes WHERE id = $1';
        client.query(query, [classId], (error) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'Please check your query',
                });
            } else {
                res.status(200).send({
                    status: 'success',
                });
            }
        });
    });
};