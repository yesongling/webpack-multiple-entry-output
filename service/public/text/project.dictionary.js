(function (global, factory) {
    return global.Dictionary = factory()
})(window, function () {
    function Dictionary(params) {
        this.name = 'Translator dictionary';
        this.version = 'v1.0';
        this.language = params.language;
        this.page = params.page;
        this.init();
    }

    Dictionary.prototype.init = function () {
        return this[this.page]()
    };

    Dictionary.prototype.token = function () {

    };

    Dictionary.prototype.home = function () {

    };

    Dictionary.prototype.login = function () {

    };

    Dictionary.prototype.register = function () {

    };

    Dictionary.prototype.global = function () {

    };

    return Dictionary
});
