function JSONRPCUI(opts) {
    var offsetStr = '  ';

    this.opts = opts;

    this.draw = function(elem) {
        var that = this;
        var container = $(elem);
        if (!container.length) {
            throw 'Element "' + elem + '" is not exists';
        }

        $.get(opts.schemeUrl).success(function(data) {
            var html = '';

            data.methods.forEach(function(method) {
                html += '<div class="jsonrpc_scheme-method-container">';
                html += '  <div class="jsonrpc_scheme-method-header">';
                html += '    <span class="jsonrpc_scheme-method-name">' + escapeHtml(method.name) + '</span>';
                html += '    <span class="jsonrpc_scheme-method-caption">' + escapeHtml(method.caption) + '</span>';
                html += '  </div>';
                html += '  <div class="jsonrpc_scheme-method-description">';
                if (method.description) {
                    html += '    <span class="jsonrpc_scheme-method-description-text">' + escapeHtml(method.description) + '</span>';
                }
                if (method.errors) {
                    html += '  <div class="jsonrpc_scheme-method-errors">';
                    html += '    <span class="jsonrpc_scheme-method-errors-caption">Errors</span>';
                    html += '    <ul>';
                    method.errors.forEach(function(error) {
                        html += '<li>'
                        html += '  <span class="jsonrpc_scheme-method-error-id">' + error.id + '</span>';
                        html += '  <span class="jsonrpc_scheme-method-error-message">' + error.message + '</span>';
                        html += '  <span class="jsonrpc_scheme-method-error-description">' + error.data + '</span>';
                        html += '</li>';
                    });
                    html += '    </ul>';
                    html += '  </div>';
                }
                html += '  </div>';

                html += '  <div class="jsonrpc_scheme-method-request">';
                html += '    <span class="jsonrpc_scheme-method-request-caption">Request</span>';
                html += '    <table>';
                html += '      <tr>';
                html += '        <th>Params</th>';
                html += '        <th>Scheme</th>';
                html += '      </tr>';
                html += '      <tr>';
                html += '        <td><textarea class="jsonrpc_scheme-method-request-params"></textarea></td>';
                html += '        <td><textarea class="jsonrpc_scheme-method-request-scheme">' + that._schemeToHtml(method.params, '') + '</textarea></td>';
                html += '      </tr>';
                html += '    </table>';

                html += '    <button onclick="">Try</button>';

                html += '  </div>';
                html += '</div>';
            })

            container.html(html);
        });
    };

    this._schemeToHtml = function(param, offset) {
        var html = "";

        switch (param.type) {
            case 'object':
                html += "{\n";
                for (var f in param.fields) {
                    html += offset + offsetStr + escapeHtml('"' + f + '": ') + this._schemeToHtml(param.fields[f], offset + offsetStr) + "\n";
                }
                html += offset + '},';
                break;
            case 'array':
                html += "[\n";
                html += offset + offsetStr + this._schemeToHtml(param.value_type, offset + offsetStr) + "\n";
                html += offset + '],';
                break;
            case 'map':
                html += "{\n";
                html += offset + offsetStr + escapeHtml('<key, ' + param.key_type + '>: ');
                html += this._schemeToHtml(param.value_type, offset + offsetStr) + "\n";
                html += offset + '},';
                break;
            default:
                html += escapeHtml('<' + param.type + '>') + ',';
        }

        return html;
    };
}

function escapeHtml(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return String(string).replace(/[&<>"'\/]/g, function(s) {
        return entityMap[s];
    });
}