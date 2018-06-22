const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    "db_host": process.env.DB_HOST,
    "logger": {
        "type": "console",
        "level": "DEBUG"
    }
};
