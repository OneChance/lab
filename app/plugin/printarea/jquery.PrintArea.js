/**
 *  Version 2.4.0 Copyright (C) 2013
 *  Tested in IE 11, FF 28.0 and Chrome 33.0.1750.154
 *  No official support for other browsers, but will TRY to accommodate challenges in other browsers.
 *  Example:
 *      Print Button: <div id="print_button">Print</div>
 *      Print Area  : <div class="PrintArea" id="MyId" class="MyClass"> ... html ... </div>
 *      Javascript  : <script>
 *                       $("div#print_button").click(function(){
 *                           $("div.PrintArea").printArea( [OPTIONS] );
 *                       });
 *                     </script>
 *  options are passed as json (example: {mode: "popup", popClose: false})
 *
 *  {OPTIONS}   | [type]     | (default), values      | Explanation
 *  ---------   | ---------  | ---------------------- | -----------
 *  @mode       | [string]   | (iframe),popup         | printable window is either iframe or browser popup
 *  @popHt      | [number]   | (500)                  | popup window height
 *  @popWd      | [number]   | (400)                  | popup window width
 *  @popX       | [number]   | (500)                  | popup window screen X position
 *  @popY       | [number]   | (500)                  | popup window screen Y position
 *  @popTitle   | [string]   | ('')                   | popup window title element
 *  @popClose   | [boolean]  | (false),true           | popup window close after printing
 *  @extraCss   | [string]   | ('')                   | comma separated list of extra css to include
 *  @retainAttr | [string[]] | ["id","class","style"] | string array of attributes to retain for the containment area. (ie: id, style, class)
 *  @standard   | [string]   | strict, loose, (html5) | Only for popup. For html 4.01, strict or loose document standard, or html 5 standard
 *  @extraHead  | [string]   | ('')                   | comma separated list of extra elements to be appended to the head tag
 */
(function ($) {
  let counter = 0;
  const modes = { iframe: 'iframe', popup: 'popup' };
  const standards = { strict: 'strict', loose: 'loose', html5: 'html5' };
  const defaults = {
    mode: modes.iframe,
    standard: standards.html5,
    popHt: 500,
    popWd: 400,
    popX: 200,
    popY: 200,
    popTitle: '',
    popClose: false,
    extraCss: '',
    extraHead: '',
    retainAttr: ['id', 'class', 'style'],
  };

  const settings = {};// global settings

  $.fn.printArea = function (options) {
    $.extend(settings, defaults, options);

    counter++;
    const idPrefix = 'printArea_';
    $(`[id^=${idPrefix}]`).remove();

    settings.id = idPrefix + counter;

    const $printSource = $(this);

    const PrintAreaWindow = PrintArea.getPrintWindow();

    PrintArea.write(PrintAreaWindow.doc, $printSource);

    setTimeout(() => { PrintArea.print(PrintAreaWindow); }, 1000);
  };

  var PrintArea = {
    print(PAWindow) {
      const paWindow = PAWindow.win;

      $(PAWindow.doc).ready(() => {
        paWindow.focus();
        paWindow.print();

        if (settings.mode == modes.popup && settings.popClose) setTimeout(() => { paWindow.close(); }, 2000);
      });
    },
    write(PADocument, $ele) {
      PADocument.open();
      PADocument.write(`${PrintArea.docType()}<html>${PrintArea.getHead()}${PrintArea.getBody($ele)}</html>`);
      PADocument.close();
    },
    docType() {
      if (settings.mode == modes.iframe) return '';

      if (settings.standard == standards.html5) return '<!DOCTYPE html>';

      const transitional = settings.standard == standards.loose ? ' Transitional' : '';
      const dtd = settings.standard == standards.loose ? 'loose' : 'strict';

      return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
    },
    getHead() {
      let extraHead = '';
      let links = '';

      if (settings.extraHead) settings.extraHead.replace(/([^,]+)/g, (m) => { extraHead += m; });

      $(document).find('link')
        .filter(function () { // Requirement: <link> element MUST have rel="stylesheet" to be considered in print document
          const relAttr = $(this).attr('rel');
          return ($.type(relAttr) === 'undefined') == false && relAttr.toLowerCase() == 'stylesheet';
        })
        .filter(function () { // Include if media is undefined, empty, print or all
          const mediaAttr = $(this).attr('media');
          return $.type(mediaAttr) === 'undefined' || mediaAttr == '' || mediaAttr.toLowerCase() == 'print' || mediaAttr.toLowerCase() == 'all';
        })
        .each(function () {
          links += `<link type="text/css" rel="stylesheet" href="${$(this).attr('href')}" >`;
        });
      if (settings.extraCss) settings.extraCss.replace(/([^,\s]+)/g, (m) => { links += `<link type="text/css" rel="stylesheet" href="${m}">`; });

      return `<head><title>${settings.popTitle}</title>${extraHead}${links}</head>`;
    },
    getBody(elements) {
      let htm = '';
      const attrs = settings.retainAttr;
      elements.each(function () {
        const ele = PrintArea.getFormData($(this));

        let attributes = '';
        for (let x = 0; x < attrs.length; x++) {
          const eleAttr = $(ele).attr(attrs[x]);
          if (eleAttr) attributes += `${(attributes.length > 0 ? ' ' : '') + attrs[x]}='${eleAttr}'`;
        }

        htm += `<div ${attributes}>${$(ele).html()}</div>`;
      });

      return `<body>${htm}</body>`;
    },
    getFormData(ele) {
      const copy = ele.clone();
      const copiedInputs = $('input,select,textarea', copy);
      $('input,select,textarea', ele).each(function (i) {
        let typeInput = $(this).attr('type');
        if ($.type(typeInput) === 'undefined') typeInput = $(this).is('select') ? 'select' : $(this).is('textarea') ? 'textarea' : '';
        const copiedInput = copiedInputs.eq(i);

        if (typeInput == 'radio' || typeInput == 'checkbox') copiedInput.attr('checked', $(this).is(':checked'));
        else if (typeInput == 'text') copiedInput.attr('value', $(this).val());
        else if (typeInput == 'select') {
          $(this).find('option').each(function (i) {
            if ($(this).is(':selected')) $('option', copiedInput).eq(i).attr('selected', true);
          });
        } else if (typeInput == 'textarea') copiedInput.text($(this).val());
      });
      return copy;
    },
    getPrintWindow() {
      switch (settings.mode) {
        case modes.iframe:
          var f = new PrintArea.Iframe();
          return { win: f.contentWindow || f, doc: f.doc };
        case modes.popup:
          var p = new PrintArea.Popup();
          return { win: p, doc: p.doc };
      }
    },
    Iframe() {
      const frameId = settings.id;
      const iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
      let iframe;

      try {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        $(iframe).attr({ style: iframeStyle, id: frameId, src: `#${new Date().getTime()}` });
        iframe.doc = null;
        iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
      } catch (e) { throw `${e}. iframes may not be supported in this browser.`; }

      if (iframe.doc == null) throw 'Cannot find document.';

      return iframe;
    },
    Popup() {
      let windowAttr = 'location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no';
      windowAttr += `,width=${settings.popWd},height=${settings.popHt}`;
      windowAttr += `,resizable=yes,screenX=${settings.popX},screenY=${settings.popY},personalbar=no,scrollbars=yes`;

      const newWin = window.open('', '_blank', windowAttr);

      newWin.doc = newWin.document;

      return newWin;
    },
  };
}(jQuery));
