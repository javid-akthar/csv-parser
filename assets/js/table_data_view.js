// search function for seraching with keyword in csv file
function searchFunction(event, id) {
    event.preventDefault();
    let searchKey = document.getElementById("searchItem" + id).value;
    searchKey = searchKey.toLowerCase()
    document.getElementById("notification-container").style.display = "block";
    document.getElementById("notification-container").innerText = "Searching pls wait..."
    $.ajax({
        type: 'post',
        url: '/file/open/search',
        data: { searchKey, id },
        success: function (data) {
            document.getElementById("myTable" + id).innerHTML = "";
            document.getElementById("myTable" + id).innerHTML = data.data.html;
            document.getElementById("notification-container").style.display = "none";
        }, error: function (error) {
            console.log(error.responseText);
        }
    });
}

// function to sort the row with column wise
function sortFunction(colName, id) {
    document.getElementById("notification-container").style.display = "block";
    document.getElementById("notification-container").innerText = "Sorting pls wait..."
    $.ajax({
        type: 'post',
        url: '/file/open/sort',
        data: { colName, id },
        success: function (data) {
            document.getElementById("myTable" + id).innerHTML = "";
            document.getElementById("myTable" + id).innerHTML = data.data.html;
            document.getElementById("notification-container").style.display = "none";
        }, error: function (error) {
            console.log(error.responseText);
        }
    });
}
