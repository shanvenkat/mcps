'use strict';
/*
* overlay.js
* a utility factory to render some content in a dialog
*/
angular.module('mcfp.Overlay', [])
.factory('Overlay', ['cssInjector', '$compile', '$templateCache', function(cssInjector, $compile, $templateCache) {
        var $overlay = $('<div class="overlay">'),
            _factory = {};

        // sContent can be a text string or HTML
        // returns the overlay jQuery object
        _factory.show = function($scope, sTemplateName, fBeforeShow) {
          var sTemplateHtml = sTemplateName ? $templateCache.get(sTemplateName) : '',
              $template = $(sTemplateHtml);

          if (sTemplateName) {
              $template = $compile($template)($scope);
          }

          $overlay.load('/views/overlay/overlay.html', function() {
              $overlay.find('.popup-text').html($template);
              $('body').append($overlay);
              if (fBeforeShow) fBeforeShow($overlay);
              $overlay.css('visibility','visible').hide().fadeIn(360);
          });

          return $overlay;
        }

        _factory.showByTemplateName = function($scope, sTemplateName) {
            var oFunctions = {
                'installations-overlay': function(_$overlay) {
                    _$overlay.find('.icon-button.top-right p').text('CLOSE');
                    _$overlay.addClass('fullscreen branch-filter-overlay');
                    _$overlay.find('.popup-window, .red-button-container').addClass('fullscreen');
                    _$overlay.find('.red-button-container').remove();
                    _$overlay.find('.popup-heading').text('ALL INSTALLATIONS').addClass('section-header');
                }
            };

            return _factory.show($scope, sTemplateName, oFunctions[sTemplateName]);
        }

        window.fOverlayClose = function() {
          $overlay.hide(350, function(){
            $overlay.remove();
          });
        }

        return _factory;
	}
]);
