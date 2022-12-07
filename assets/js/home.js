function loadingbtn(id) {
    console.log($('#' + 'file-open' + id));
    window.location = $('#' + 'file-open' + id).attr('href');
}