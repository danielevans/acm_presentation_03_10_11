var ANIMATION_SPEED = 1000;
var makeCssClasses = function(items){
    return _(items).chain().compact().map(function(item){
        return _.compact(item.toLowerCase().split(/\s/)).join('_');
    }).value().join(' ');
};

var processObject = function(body){
    var $body = $('<div></div>');
    var cssItems = [body.type, body.class];

    if(body.type == "planet"){
        cssItems.push(body.habitable ? "habitable" : "uninhabitable");
        if((body.sattelites || []).length == 0){
            cssItems.push("moonless");
        }
    }

    $body.addClass(makeCssClasses(cssItems));
    $body.attr('id', (body.name || '').toLowerCase());
    $body.text(body.name || '');

    _.each(body.satelites || [], function(satelite){
        $body.append(processObject(satelite));
    });

    return $body;
};

$(function(){
    $.ajax({
        url: 'planets.json',
        dataType: 'json',
        success: function(data){
            $('body').append(processObject(data));
        },
        error: function(error){
            alert('An error occurred: ' + error);
        }
    });
    
    $(document).click(function(){
        $('div').fadeOut(ANIMATION_SPEED, function(){
            var showman = function(selectors){
                if(selectors && selectors.length > 0){
                    $(_.first(selectors)).fadeIn(ANIMATION_SPEED, function(){
                        showman(_.tail(selectors));
                    });
                }
            };
            showman(['.star', '.planet, .plutoid', '.moon', 'div:hidden']);
        });
    });
});