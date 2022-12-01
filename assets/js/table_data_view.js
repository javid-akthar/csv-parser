    function searchFunction(event ,id) {
        console.log('event',event);
        event.preventDefault();
        let searchKey = document.getElementById("searchItem" + id).value;
        searchKey = searchKey.toLowerCase()
        console.log('searchKey', searchKey);
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

    function sortFunction(colName, id) {
        console.log("functioncalled");
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
