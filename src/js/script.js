function getTextValue(id) {
    return document.getElementById(id).value;
}
function pad(n, width, z) {
    width = width || 2;
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function closePopup(id) {
    var e = document.getElementById(id);
    if (e) {
        e.style.display = 'none';
    }
}
function displayPopup(id, errorFlg) {
    var e = document.getElementById(id);
    if (e) {
        e.style.display = 'block';
    } else
        console.log('!!not found!!', id);
    if (errorFlg) {
        var errorSound = new Audio('assets/sounds/error.mp3');
        errorSound.play();
    }
}

// csv file----------------------------
function generateCsvFile(filename, page) {
    var a = document.createElement('a');
    a.textContent = 'download';
    a.download = filename + ".csv";
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(page);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function generateXlsxFile(filename, data) {
    var a = document.createElement('a');
    a.textContent = 'download';
    a.download = filename + ".xlsx";
    a.href = 'data:application/xlsx;base64,' + data;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function generatePdfFile(filename, data) {
    var a = document.createElement('a');
    a.textContent = 'download';
    a.download = filename + ".pdf";
    a.href = 'data:application/pdf;base64,' + data;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
// currency------
function currencyObj(amount) {
    return { amount: amount, currency: formatNumberToLocalCurrency(amount) }
}
function formatNumberToLocalCurrency(amount = 0, refresh = false) {
    if (refresh || !localStorage.geoplugin_currencyCode) {
        $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
            localStorage.geoplugin_currencyCode = data.geoplugin_currencyCode;
        });
    }

    const formatter = new Intl.NumberFormat(navigator.language || 'en-US', {
        style: 'currency',
        currency: localStorage.geoplugin_currencyCode || 'USD',
        minimumFractionDigits: 0
    });
    return formatter.format(amount);
}