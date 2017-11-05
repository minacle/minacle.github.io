addEventListener('DOMContentLoaded', function (e) {
    for (var fnref of document.getElementsByClassName('footnote')) {
        var fn = document.getElementById(fnref.hash.slice(1));
        fnref.title = fn.innerText.trim().slice(0, -2);
        fnref.addEventListener('click', function (e) {
            if (e.altKey)
                return;
            var modal = document.getElementById('modal').firstElementChild;
            var div = document.createElement('div');
            div.className = 'footnote';
            modal.appendChild(div);
            var h6 = document.createElement('h2');
            h6.innerText = '각주: ' + fnref.innerText;
            div.appendChild(h6);
            var p = document.createElement('p');
            p.innerText = fnref.title;
            div.appendChild(p);
            modal.parentElement.removeAttribute('hidden');
            e.preventDefault();
        });
    }
});
