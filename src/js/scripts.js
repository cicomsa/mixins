global.jQuery = require('jquery');
bootstrap = require('bootstrap');
Mustache = require('mustache');

jQuery(document).ready(function($) {
    let jqxhr = $.getJSON('data.json', function() {

    }).done(function(data) {
        let template = $('#template').html();
        let showTemplate = Mustache.render(template, data);
        $('#gallery').html(showTemplate);
    })
});
