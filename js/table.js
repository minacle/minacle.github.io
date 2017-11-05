addEventListener('DOMContentLoaded', function (e) {
    for (var table of document.getElementsByTagName('table')) {
        var div = document.createElement('div');
        div.className = 'table';
        table.parentElement.insertBefore(div, table);
        div.appendChild(table);
    }
});
