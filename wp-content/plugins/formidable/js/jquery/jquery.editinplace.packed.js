(function(c){function k(a,b){this.settings=a;this.dom=b;this.originalValue=null;this.shouldDelayReinit=this.didInsertDefaultText=!1}function l(a){""!==a&&((new Image).src=a)}function f(a){return a.replace(/^\s+/,"").replace(/\s+$/,"")}function g(a){return void 0===a||null===a||0===a.length?!1:!0}c.fn.editInPlace=function(a){jQuery.browser={};jQuery.browser.mozilla=/mozilla/.test(navigator.userAgent.toLowerCase())&&!/webkit/.test(navigator.userAgent.toLowerCase());jQuery.browser.webkit=/webkit/.test(navigator.userAgent.toLowerCase());
jQuery.browser.opera=/opera/.test(navigator.userAgent.toLowerCase());jQuery.browser.msie=/msie/.test(navigator.userAgent.toLowerCase());jQuery.browser.safari=-1<navigator.userAgent.indexOf("Safari");var b=c.extend({},c.fn.editInPlace.defaults,a);"textarea"==b.type&&(b.use_html=!0);if(!b.url&&!b.callback)throw Error("Need to set either url: or callback: option for the inline editor to work.");l(b.saving_image);return this.each(function(){var a=c(this);a.data("editInPlace")||(a.data("editInPlace",!0),
(new k(b,a)).init())})};c.fn.editInPlace.defaults={url:"",bg_over:"inherit",bg_out:"inherit",hover_class:"",show_buttons:"Microsoft Internet Explorer"==navigator.appName?!0:!1,save_button:'<button class="inplace_save">Save</button>',cancel_button:'<button class="inplace_cancel">Cancel</button>',params:"",field_type:"text",default_text:"(Click here to add text)",use_html:1,textarea_rows:10,textarea_cols:25,select_text:"Choose new value",select_options:"",text_size:null,saving_text:void 0,saving_image:"",
saving_animation_color:"transparent",value_required:!1,element_id:"element_id",update_value:"update_value",original_value:"original_value",original_html:"original_html",save_if_nothing_changed:!1,on_blur:"save",cancel:"",callback:null,callback_skip_dom_reset:!1,success:null,error:null,error_sink:function(a,b){},preinit:null,postclose:null,delegate:null};c.extend(k.prototype,{init:function(){this.setDefaultTextIfNeccessary();this.connectOpeningEvents()},reinit:function(){this.shouldDelayReinit||(this.triggerCallback(this.settings.postclose,
this.dom),this.triggerDelegateCall("didCloseEditInPlace"),this.markEditorAsInactive(),this.connectOpeningEvents())},setDefaultTextIfNeccessary:function(){""===this.dom.html()&&(this.dom.html(this.settings.default_text),this.didInsertDefaultText=!0)},connectOpeningEvents:function(){var a=this;this.dom.bind("mouseenter.editInPlace",function(){a.addHoverEffect()}).bind("mouseleave.editInPlace",function(){a.removeHoverEffect()}).bind("click.editInPlace",function(b){a.openEditor(b)})},disconnectOpeningEvents:function(){this.dom.unbind(".editInPlace")},
addHoverEffect:function(){this.settings.hover_class?this.dom.addClass(this.settings.hover_class):this.dom.css("background-color",this.settings.bg_over)},removeHoverEffect:function(){this.settings.hover_class?this.dom.removeClass(this.settings.hover_class):this.dom.css("background-color",this.settings.bg_out)},openEditor:function(a){this.shouldOpenEditor(a)&&(this.disconnectOpeningEvents(),this.removeHoverEffect(),this.removeInsertedDefaultTextIfNeccessary(),this.saveOriginalValue(),this.markEditorAsActive(),
this.replaceContentWithEditor(),this.setInitialValue(),this.workAroundMissingBlurBug(),this.connectClosingEventsToEditor(),this.triggerDelegateCall("didOpenEditInPlace"))},shouldOpenEditor:function(a){return this.isClickedObjectCancelled(a.target)||!1===this.triggerCallback(this.settings.preinit,this.dom)||!1===this.triggerDelegateCall("shouldOpenEditInPlace",!0,a)?!1:!0},removeInsertedDefaultTextIfNeccessary:function(){this.didInsertDefaultText&&this.dom.html()===this.settings.default_text&&(this.dom.html(""),
this.didInsertDefaultText=!1)},isClickedObjectCancelled:function(a){return this.settings.cancel?0!==c(a).parents().andSelf().filter(this.settings.cancel).length:!1},saveOriginalValue:function(){this.originalValue=this.settings.use_html?this.dom.html():f(this.dom.text())},restoreOriginalValue:function(){this.setClosedEditorContent(this.originalValue)},setClosedEditorContent:function(a){this.settings.use_html?this.dom.html(a):this.dom.text(a)},workAroundMissingBlurBug:function(){var a=this.dom.find(":input");
this.dom.parents(":last").find(".editInPlace-active :input").not(a).blur()},replaceContentWithEditor:function(){var a=this.settings.show_buttons?this.settings.save_button+" "+this.settings.cancel_button:"",b=this.createEditorElement();this.dom.html("").append('<form class="inplace_form" style="display: inline; margin: 0; padding: 0;"></form>').find("form").append(b).append(a)},createEditorElement:function(){if(-1===c.inArray(this.settings.field_type,["text","textarea","select"]))throw"Unknown field_type <fnord>, supported are 'text', 'textarea' and 'select'";
var a=null;"select"===this.settings.field_type?a=this.createSelectEditor():"text"===this.settings.field_type?a=c('<input type="text" '+this.inputNameAndClass()+' size="'+this.settings.text_size+'" />'):"textarea"===this.settings.field_type&&(a=c("<textarea "+this.inputNameAndClass()+' rows="'+this.settings.textarea_rows+'"  cols="'+this.settings.textarea_cols+'" />'));return a},setInitialValue:function(){var a=this.triggerDelegateCall("willOpenEditInPlace",this.originalValue),b=this.dom.find(":input");
b.val(a);b.val()!==a&&b.val("")},inputNameAndClass:function(){return' name="inplace_value" class="inplace_field" '},createSelectEditor:function(){var a=c("<select"+this.inputNameAndClass()+'><option disabled="true" value="">'+this.settings.select_text+"</option></select>"),b=this.settings.select_options;c.isArray(b)||(b=b.split(","));for(var e=0;e<b.length;e++){var d=b[e];c.isArray(d)||(d=d.split(":"));var h=f(d[1]||d[0]),d=f(d[0]),h=c("<option>").val(h).text(d);a.append(h)}return a},connectClosingEventsToEditor:function(){function a(a){e.handleCancelEditor(a);
return!1}function b(a){e.handleSaveEditor(a);return!1}var e=this,d=this.dom.find("form");d.find(".inplace_field").focus().select();d.find(".inplace_cancel").click(a);d.find(".inplace_save").click(b);this.settings.show_buttons||("save"===this.settings.on_blur?d.find(".inplace_field").blur(b):d.find(".inplace_field").blur(a),(c.browser.mozilla||c.browser.msie)&&this.bindSubmitOnEnterInInput());d.keyup(function(b){if(27===b.which)return a()});c.browser.safari&&this.bindSubmitOnEnterInInput();d.submit(b)},
bindSubmitOnEnterInInput:function(){if("textarea"!==this.settings.field_type){var a=this;this.dom.find(":input").keyup(function(b){if(13===b.which)return a.dom.find("form").submit()})}},handleCancelEditor:function(a){!1!==this.triggerDelegateCall("shouldCloseEditInPlace",!0,a)&&(a=this.dom.find(":input").val(),a=this.triggerDelegateCall("willCloseEditInPlace",a),this.restoreOriginalValue(),g(a)&&!this.isDisabledDefaultSelectChoice()&&this.setClosedEditorContent(a),this.reinit())},handleSaveEditor:function(a){if(!1!==
this.triggerDelegateCall("shouldCloseEditInPlace",!0,a)){var b=this.dom.find(":input").val(),b=this.triggerDelegateCall("willCloseEditInPlace",b);this.isDisabledDefaultSelectChoice()||this.isUnchangedInput(b)?this.handleCancelEditor(a):this.didForgetRequiredText(b)?(this.handleCancelEditor(a),this.reportError("Error: You must enter a value to save this field")):(this.showSaving(b),this.settings.callback?this.handleSubmitToCallback(b):this.handleSubmitToServer(b))}},didForgetRequiredText:function(a){return this.settings.value_required&&
(""===a||void 0===a||null===a)},isDisabledDefaultSelectChoice:function(){return this.dom.find("option").eq(0).is(":selected:disabled")},isUnchangedInput:function(a){return!this.settings.save_if_nothing_changed&&this.originalValue===a},showSaving:function(a){this.settings.callback&&this.settings.callback_skip_dom_reset||(g(this.settings.saving_text)&&(a=this.settings.saving_text),g(this.settings.saving_image)&&(a=c("<img />").attr("src",this.settings.saving_image).attr("alt",a)),this.dom.html(a))},
handleSubmitToCallback:function(a){this.enableOrDisableAnimationCallbacks(!0,!1);var b=this.triggerCallback(this.settings.callback,this.id(),a,this.originalValue,this.settings.params,this.savingAnimationCallbacks());this.settings.callback_skip_dom_reset||(void 0===b?(this.reportError("Error: Failed to save value: "+a),this.restoreOriginalValue()):this.dom.html(b));this.didCallNoCallbacks()&&(this.enableOrDisableAnimationCallbacks(!1,!1),this.reinit())},handleSubmitToServer:function(a){a=this.settings.update_value+
"="+encodeURIComponent(a)+"&"+this.settings.element_id+"="+this.dom.attr("id")+(this.settings.params?"&"+this.settings.params:"")+"&"+this.settings.original_html+"="+encodeURIComponent(this.originalValue)+"&"+this.settings.original_value+"="+encodeURIComponent(this.originalValue);this.enableOrDisableAnimationCallbacks(!0,!1);this.didStartSaving();var b=this;c.ajax({url:b.settings.url,type:"POST",data:a,dataType:"html",complete:function(a){b.didEndSaving()},success:function(a){b.dom.html(a||b.settings.default_text);
b.triggerCallback(b.settings.success,a)},error:function(a){b.dom.html(b.originalHTML);b.settings.error?b.triggerCallback(b.settings.error,a):b.reportError("Failed to save value: "+a.responseText||"Unspecified Error")}})},triggerCallback:function(a){if(a){var b=Array.prototype.slice.call(arguments,1);return a.apply(this.dom[0],b)}},triggerDelegateCall:function(a,b,e){if(!this.settings.delegate||!c.isFunction(this.settings.delegate[a]))return b;a=this.settings.delegate[a](this.dom,this.settings,e);
return void 0===a?b:a},reportError:function(a){this.triggerCallback(this.settings.error_sink,this.id(),a)},id:function(){return this.dom.attr("id")},markEditorAsActive:function(){this.dom.addClass("editInPlace-active")},markEditorAsInactive:function(){this.dom.removeClass("editInPlace-active")},savingAnimationCallbacks:function(){var a=this;return{didStartSaving:function(){a.didStartSaving()},didEndSaving:function(){a.didEndSaving()}}},enableOrDisableAnimationCallbacks:function(a,b){this.didStartSaving.enabled=
a;this.didEndSaving.enabled=b},didCallNoCallbacks:function(){return this.didStartSaving.enabled&&!this.didEndSaving.enabled},assertCanCall:function(a){if(!this[a].enabled)throw Error("Cannot call "+a+" now. See documentation for details.");},didStartSaving:function(){this.assertCanCall("didStartSaving");this.shouldDelayReinit=!0;this.enableOrDisableAnimationCallbacks(!1,!0);this.startSavingAnimation()},didEndSaving:function(){this.assertCanCall("didEndSaving");this.shouldDelayReinit=!1;this.enableOrDisableAnimationCallbacks(!1,
!1);this.reinit();this.stopSavingAnimation()},startSavingAnimation:function(){var a=this;this.dom.animate({backgroundColor:this.settings.saving_animation_color},400).animate({backgroundColor:"transparent"},400,"swing",function(){setTimeout(function(){a.startSavingAnimation()},10)})},stopSavingAnimation:function(){this.dom.stop(!0).css({backgroundColor:""})},missingCommaErrorPreventer:""})})(jQuery);