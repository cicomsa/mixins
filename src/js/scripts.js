global.jQuery = require('jquery');
bootstrap = require('bootstrap');
Mustache = require('mustache');

jQuery(document).ready(function($) {
    const jqxhr = $.getJSON('data.json', function() {

    }).done(function(data) {
        const template = $('#template').html();
        const showTemplate = Mustache.render(template, data);
        $('#gallery').html(showTemplate);
    })
});


