const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.should();
chai.use(chaiHttp);





//USER TESTCASES
describe('TC-20x - User', () => {
    //TESTCASE 201 -------------------------------------------------------------------------------------------------
    describe('TC-201 Registreren als nieuwe user', () => {
        it('TC-201-1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    //emailAddress ontbreekt
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });

        it('TC-201-2-1 Niet-valide emailadres', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: '@hotmail.com'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-2-2 Niet-valide emailadres', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: ''
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-2-3 Niet-valide emailadres', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: 'john@.com'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });


        it('TC-201-3-1 Niet-valide wachtwoorden', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: 'j.dewitt@hotmail.com',
                    password: '123123123'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });

        it('TC-201-3-2 Niet-valide wachtwoorden', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: 'j.dewitt@hotmail.com',
                    password: 'Pass123'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });


        it('TC-201-4 Gebruiker bestaat al', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: 'e.garm@server.com',
                    password: 'Pass123'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(403);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Derek',
                    lastName: 'Peters',
                    street: '123 Main St',
                    city: 'Anytown',
                    emailAddress: 'd.peters@avans.nl',
                    phoneNumber: '555-1234',
                    password: 'Password1234'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status', 201);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.not.be.empty;

                    let { firstName, lastName, emailAddress } = res.body.data;
                    firstName.should.be.a('string').to.be.equal('Derek');
                    lastName.should.be.a('string').to.be.equal('Peters');
                    emailAddress.should.be.a('string').to.be.equal('d.peters@avans.nl');
                    done();
                });
        });
    });

    //TESTCASE 202 -------------------------------------------------------------------------------------------------
    describe('TC-202 Opvragen van overzicht users', () => {
        it('TC-202-1 Opvragen van overzicht users', (done) => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    res.should.have.status(200);
                    done();
                });
        });

        it('TC-202-2-1 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
            chai.request(server)
                .get('/api/user?fakeFilter=fake')
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.empty;
                    done();
                });


        });
        it('TC-202-2-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
            chai.request(server)
                .get('/api/user?awodiajwodiawjd=aoiwdjoaiwd')
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.empty;
                    done();
                });
        });

        it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false', (done) => {
            chai.request(server)
                .get('/api/user?isActive=false')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('Gijs');
                    filteredUser.lastName.should.equal('Ernst');
                    done();
                });
        });
        it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true', (done) => {
            chai.request(server)
                .get('/api/user?isActive=true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('John');
                    filteredUser.lastName.should.equal('Evans');
                    done();
                });

        });
        it('TC-202-5-1 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
            chai.request(server)
                .get('/api/user?city=Breda&isActive=true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('John');
                    filteredUser.lastName.should.equal('Evans');
                    filteredUser.isActive.should.equal(true);
                    filteredUser.city.should.equal('Breda');

                    const filteredUser2 = res.body.data[1];
                    filteredUser2.isActive.should.equal(true);
                    filteredUser2.city.should.equal('Breda');
                    done();
                });

        });
        it('TC-202-5-2 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
            chai.request(server)
                .get('/api/user?city=Leeuwarden')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.city.should.equal('Leeuwarden');

                    const filteredUser2 = res.body.data[1];
                    filteredUser2.city.should.equal('Leeuwarden');

                    done();
                });

        });


    });
    describe('TC-203 Opvragen van gebruikersprofiel', () => {
        it('TC-203-1 Ongeldig token', (done) => {
            chai.request(server)
                .get('/api/user/profile')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-203-2 Gebruiker is ingelogd met geldig token', (done) => {
            chai.request(server)
                .get('/api/user/profile')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('John');
                    filteredUser.lastName.should.equal('Evans');
                    filteredUser.city.should.equal('Breda');

                    done();
                });
        });
    });
    describe('TC-204 Opvragen van usergegevens bij ID', () => {
        it('TC-204-1 Ongeldig token', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-204-3-1 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('John');

                    done();
                });
        });
        it('TC-204-3-2 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/2')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('Gijs');
                    done();

                });
        });
    });
    describe('TC-205 Updaten van usergegevens', () => {
        it('TC-205-1 Verplicht veld "emailAddress" ontbreekt', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-3 Niet-valide telefoonnummer', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-4 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-5 Niet ingelogd', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-6 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/:userid')
                .end((err, res) => {
                    done();
                });
        });
    });

});
describe('TC-206 Verwijderen van user', () => {
    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .get('/api/user/:userid')
            .end((err, res) => {
                done();
            });
    });
    it('TC-206-2 Gebruiker is niet ingelogd', (done) => {
        chai.request(server)
            .get('/api/user/:userid')
            .end((err, res) => {
                done();
            });
    });
    it('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
        chai.request(server)
            .get('/api/user/:userid')
            .end((err, res) => {
                done();
            });
    });
    it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
        chai.request(server)
            .delete('/api/user/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').to.be.equal('User with ID 1 has been deleted')
                res.body.should.has.property('data');
                chai.request(server)
                    .get('/api/user/1')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.has.property('data').to.be.empty;
                        done();
                    });
            });
    });
});