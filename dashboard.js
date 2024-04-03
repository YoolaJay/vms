 // Function to display current date and time
 function displayTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    // Update the calendar and time elements
    document.getElementById('calendar').innerText = formattedDate;
    document.getElementById('current-time').innerText = 'Time: ' + formattedTime;

}

// Update time every second
setInterval(displayTime, 1000);

// Initial call to display time
displayTime();

function openModal() {
    console.log('Im hit')
    document.getElementById('visitorModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('visitorModal').style.display = 'none';
}

// Function to get the current time and set it to the input field
function setCurrentTime() {
    // Get the current date and time
    const now = new Date();
    
    // Get hours, minutes, and AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12

    // Pad minutes with leading zeros if needed
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Set the value of the input field with the current time
    document.getElementById('timeIn').value = hours + ':' + formattedMinutes + ' ' + ampm;
}

// Call the setCurrentTime function when the page loads
window.onload = setCurrentTime;


function addVisitor() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const visitee = document.getElementById('visitee').value;
    const timeIn = document.getElementById('timeIn').value;
    const timeOut = document.getElementById('timeOut').value;

    const data = { firstName, lastName, phoneNumber, visitee, timeIn, timeOut };
    console.log(data)

    // Send POST request to the API endpoint
    axios.post('http://localhost:3001/visitors', data)
        .then(response => {
            console.log(response.data);
            // Handle success response
            alert('Visitor added successfully');
            location.reload();
        })
        .catch(error => {
            console.error(error);
            // Handle error response
            alert('Error adding visitor');
        });
}

// Make a GET request to fetch visitors data
axios.get('http://localhost:3001/visitors')
  .then(response => {
    // Handle successful response
    const visitors = response.data;
    const tableBody = document.querySelector('tbody');
    const totalVisitors = visitors.length; // Total number of visitors
    const checkedOutVisitors = visitors.filter(visitor => visitor.timeOut !== 'pending').length; // Number of visitors who have checked out


    document.getElementById('totalVisitorsCount').innerText = totalVisitors;
    document.getElementById('checkedOutVisitorsCount').innerText = checkedOutVisitors;

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate over the visitors array and add rows to the table
    visitors.forEach(visitor => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${visitor.firstName}</td>
        <td>${visitor.lastName}</td>
        <td>${visitor.phoneNumber}</td>
        <td>${visitor.visitee}</td>
        <td>${visitor.timeIn}</td>
        <td>${visitor.timeOut}</td>
        <td>

            <button class="checkout-btn" onclick="openCheckoutModal(this.parentNode.parentNode)" ${visitor.timeOut !== 'pending' ? 'disabled' : ''}>
                ${visitor.timeOut !== 'pending' ? 'Checked Out' : 'Check Out'}
            </button>
        </td>
      `;
      tableBody.appendChild(row);

      if (visitor.timeOut !== 'pending') {
        const button = row.querySelector('.checkout-btn');
        button.disabled = true;
        button.style.backgroundColor = '#a9a9a9'; // Gray background
        button.style.border = '#d3d3d3'; // Gray background
        button.style.cursor = 'not-allowed'; // Change cursor to not-allowed
    }
    });
  })
  .catch(error => {
    // Handle error
    console.error('Error fetching visitors:', error);
    // Display error message to the user or handle it as needed
    document.querySelector('tbody').innerHTML = 'No data'
  });


  // Function to open checkout modal and populate data
function openCheckoutModal(row) {
    const cells = row.getElementsByTagName('td');
    document.getElementById('checkoutFirstName').value = cells[0].innerText;
    document.getElementById('checkoutLastName').value = cells[1].innerText;
    document.getElementById('checkoutPhoneNumber').value = cells[2].innerText;
    document.getElementById('checkoutVisitee').value = cells[3].innerText;
    document.getElementById('checkoutTimeIn').value = cells[4].innerText;

    // Get current time and format it
    const currentTime = moment().format('hh:mm a');
    document.getElementById('currentTime').value = currentTime;

    // Show checkout modal
    document.getElementById('checkoutModal').style.display = 'block';
}

// Function to close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Function to handle checkout action
function checkoutVisitor() {
    const firstName = document.getElementById('checkoutFirstName').value;
    const lastName = document.getElementById('checkoutLastName').value;
    const phoneNumber = document.getElementById('checkoutPhoneNumber').value;
    const visitee = document.getElementById('checkoutVisitee').value;
    const timeOut = document.getElementById('currentTime').value; // Update to use currentTime field

    // Get current date and time
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: true });

    // Send checkout data to server with updated timeOut
    axios.post('http://localhost:3001/visitors/checkout', { firstName, lastName, phoneNumber, visitee, timeOut })
        .then(response => {
            // Handle successful checkout
            // console.log('Visitor checked out successfully:', response.data);
            // // Reload the page to reflect changes
            // location.reload();

            if (response.status === 200) {
                console.log('Visitor checked out successfully:', response.data);
                // Reload the page to reflect changes
                location.reload();
                document.getElementById('checkoutButton').disabled = true;

            } else {
                console.error('Error checking out visitor:', response.data.message);
                // Display error message to the user or handle it as needed
                alert('Error checking out visitor: ' + response.data.message);
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error checking out visitor:', error);
            // Display error message to the user or handle it as needed
        })
        .finally(() => {
            // Close checkout modal
            closeCheckoutModal();
        });
}

// Function to filter visitors based on search query
function filterVisitors() {
    const searchInput = document.querySelector('.search-wrapper input');
    const searchQuery = searchInput.value.toLowerCase(); // Convert search query to lowercase for case-insensitive search
    const visitorRows = document.querySelectorAll('.visitors table tbody tr');

    // Iterate over each visitor row and check if the name matches the search query
    visitorRows.forEach(row => {
        const firstName = row.cells[0].innerText.toLowerCase(); // Get first name
        const lastName = row.cells[1].innerText.toLowerCase(); // Get last name
        const fullName = firstName + ' ' + lastName; // Concatenate first name and last name

        // If the full name contains the search query, show the row, otherwise hide it
        if (fullName.includes(searchQuery)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add event listener to search input for keyup event
document.querySelector('.search-wrapper input').addEventListener('keyup', filterVisitors);
