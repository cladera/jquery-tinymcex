(function($){
    $.widget("ui.tinymcex", {
        options: {
            tinymce: {
                script_url: 'lib/tinymce/jscripts/tiny_mce/tiny_mce.js',
                theme : 'advanced',
                theme_advanced_buttons1 : 'bold,italic,underline,|,justifyleft,justifycenter,justifyright,fontselect,fontsizeselect,|,forecolor,backcolor,|,cut,copy,paste,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,|,sub,sup,|,charmap,code',
                theme_advanced_buttons2 : '',
                theme_advanced_buttons3 : '',
                theme_advanced_buttons4 : '',
                theme_advanced_toolbar_location : 'top',
                theme_advanced_toolbar_align : 'left',
                theme_advanced_resizing : false,
                width : "100%",
                height : "250"
            },
            controls: {
                'Edit' : {
                    click: function(control){
                        this._showEditor();
                    },
                    
                }
            }
        },
        _create: function(){
            var self = this;
            //Initialize properties
            this.controls = [];
            //Apply container class to emlement
            this.element.addClass('ui-tinymcex-container');
            //Create content box
            this.content = $('<div class="ui-tinymcex-content"></div>');
            //Check if exists textarea
            var taChildren = $(this.element).find('textarea');
            console.log(taChildren.length);
            if(taChildren.length){
                this.textarea = $(taChildren[0]);
            }else {
                //Create new text area
                this.element.html('');
                this.textarea = $('<textarea></textarea>');
            }
            //Add new content box to element
            this.element.append(this.content);
            //Move Textarea content to new content box
            this.content.html(this.textarea.val());
            this.content.click(function(){
                self._showEditor();
            });
            //Build controls
            this._buildControls();
            
            //Append textarea
            this.element.prepend(this.textarea);
            this.textarea.hide();
        },
        destroy: function(){
            console.log(this.element.attr("id"));
            var content = this.getContent();
            this.content.remove();
            this.controlsBar.remove();
            this.element.html(content);
            this.element.removeClass('ui-tinymcex-container');
            
            return this;
        },
        getContent: function(){
            return this.textarea.val();
        },
        _buildControls: function()
        {
            var self = this;
            //Create controls bar
            this.controlsBar = $('<div class="ui-tinymcex-controls"></div>');
            this.element.append(this.controlsBar);
            //Create controls
            $.each(this.options.controls, function(key, control){
                var ctrl = $('<a href="#" class="ui-tinymcex-control">'+key+'</a>');
                self.controlsBar.append(ctrl);
                self.controls.push(ctrl);
                $.each(control, function(event, handler){
                    ctrl.bind(event, function(event){
                        event.preventDefault();
                        handler.call(self, ctrl); 
                    });
                });
               
            });
        },
        _showEditor: function()
        {
            //Create update button
            var update = $('<a href="#" class="ui-tinymcex-control">Update</a>');
            var self = this;
            //Hide controls
            $.each(this.controls, function(key, control){
                control.hide();
            });
            // Declare update listner
            update.click(function(e){
                //Prevent default click event
                e.preventDefault();
                //Remove update button
                $(this).remove();
                //Hide editor
                self._hideEditor();
                
            });
            this.controlsBar.append(update);
            //Show textarea
            this.textarea.show();
            //Transfor textarea to a tiny
            if(this.options.tinymce.width === "100%")
            {
                this.options.tinymce.width = this.element.width();
            }
            $(this.textarea).tinymce(self.options.tinymce);
            this.content.hide();
        },
        _hideEditor: function()
        {
            //Show new content
            this.content.html($(this.textarea).tinymce().getContent());
            //Remove tinymce
            $(this.textarea).tinymce().remove();
            this.textarea.hide();
            //Show controls
            $.each(this.controls, function(key, control){
                control.show();
            });
            //Show content box
            this.content.show();
        }
    });

})(jQuery);