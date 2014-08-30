/**
 * @file 双向数据绑定
 * @author hushicai(bluthcy@gmail.com)
 */

// 参考文章：http://www.lucaongaro.eu/blog/2012/12/02/easy-two-way-data-binding-in-javascript/

(function() {
    function DataBinder( object_id ) {
        // Use a jQuery object as simple PubSub
        var pubSub = jQuery({});

        // We expect a `data` element specifying the binding
        // in the form: data-bind-<object_id>="<property_name>"
        var data_attr = "data-bind-" + object_id;

        // Listen to change events on elements with the data-binding attribute and proxy
        // them to the PubSub, so that the change is "broadcasted" to all connected objects
        jQuery( document ).on( "change", "[" + data_attr + "]", function( evt ) {
            var $input = jQuery( this );

            pubSub.trigger(
                'view:' + object_id + ':change', 
                [ $input.attr(data_attr), $input.val() ] 
            );
        });

        // PubSub propagates changes to all bound elements, setting value of
        // input tags or HTML content of other tags
        pubSub.on('model:' + object_id + ':change', function( evt, prop_name, new_val ) {
            jQuery( "[" + data_attr + "=" + prop_name + "]" ).each( function() {
                var $bound = jQuery( this );

                if ( $bound.is("input, textarea, select") ) {
                    $bound.val( new_val );
                } else {
                    $bound.html( new_val );
                }
            });
        });

        return pubSub;
    }

    function User(uid){
        var binder = new DataBinder(uid);

        var user = {
            attributes: {},

            //属性设置器使用数据绑定器PubSub来发布变化   

            set: function(attr_name,val){
                this.attributes[attr_name] = val;
                binder.trigger('model:' + uid + ":change", [attr_name, val]);
            },

            get: function(attr_name){
                return this.attributes[attr_name];
            },

            _binder: binder
        };

        binder.on('view:' + uid +":change",function(vet,attr_name,new_val){
            user.set(attr_name,new_val);

            console.log(user.attributes);
        });

        return user;
    }

    var user = new User( 123 );
    user.set( "name", "Wolfgang" );
})();
