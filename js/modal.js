addEventListener('DOMContentLoaded', function (e) {
    var modal = document.createElement('div');
    modal.id = 'modal';
    modal.innerHTML = '<div></div>';
    modal.setAttribute('hidden', '');
    modal.addEventListener('click', function (e) {
        if (e.target == modal) {
            modal.innerHTML = '<div></div>';
            modal.setAttribute('hidden', '');
        }
    });
    document.body.appendChild(modal);
});
