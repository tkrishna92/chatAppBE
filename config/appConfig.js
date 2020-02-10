let appConfig = {};

appConfig.port = 3000;
appConfig.allowedCorsOrigin = "*";
appConfig.environment = "dev";
appConfig.db = {
    
    uri: "mongodb://127.0.0.1:27017/chatAppDB",    // localhost:27017
}
appConfig.apiVersion = "/api/v1";

module.exports = {
    port:appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment:appConfig.environment,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
}