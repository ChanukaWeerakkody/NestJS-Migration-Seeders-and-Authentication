module.exports = [
    {
        type: 'mysql',
         host: "localhost",
        port: 3306,
        username: "root",
        password: "1234",
        database: "sample",
        entities: ['dist/src/entities/*.js'],
        factories: ['dist/src/seeders/factories/*.*.js'],
        seeds: ['dist/src/seeders/seeds/*.js'],
    },

    // {
    //     name: 'memory',
    //     type: 'sqlite',
    //     database: ':memory:',
    //     entities: ['sample/entities/**/*{.ts,.js}'],
    //     factories: ['sample/factories/**/*{.ts,.js}'],
    //     seeds: ['sample/seeds/**/*{.ts,.js}'],
    // }
]