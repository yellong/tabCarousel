$.mockjax({
    url: '/list',
    responseTime: 650,
    contentType: 'text/json',
    response: function() {
        var list = [ 1,2,3,4,5,6,7,8,9 ];
        this.responseText = {
            list: list
        };
    }
});