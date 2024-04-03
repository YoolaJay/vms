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

axios.get('http://localhost:3001/visitors')
  .then(response => {
    // Handle successful response
    const visitors = response.data;
    const tableBody = document.querySelector('tbody');

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate over the visitors array and add rows to the table
    visitors.forEach(visitor => {
      const row = document.createElement('tr');
      row.setAttribute('data-id', visitor._id); // Set data-id attribute to the visitor's _id

      row.innerHTML = `
        <td>${visitor.firstName}</td>
        <td>${visitor.lastName}</td>
        <td>${visitor.phoneNumber}</td>
        <td>${visitor.visitee}</td>
        <td>${visitor.timeIn}</td>
        <td>${visitor.timeOut}</td>
        <td>
            <button class="action-btn edit-btn" onclick="openEditModal(this.parentNode.parentNode)">
                <span class="las la-pen"></span>
            </button>
            
            <button class="action-btn delete-btn" onclick="confirmDelete(this.parentNode.parentNode)">
                <span class="las la-trash-alt"></span>
            </button>
            
        </td>
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


  // Function to populate modal form with visitor data for editing
function openEditModal(row) {

    const cells = row.getElementsByTagName('td');
    document.getElementById('editFirstName').value = cells[0].innerText;
    document.getElementById('editLastName').value = cells[1].innerText;
    document.getElementById('editPhoneNumber').value = cells[2].innerText;
    document.getElementById('editVisitee').value = cells[3].innerText;
    document.getElementById('editTimeIn').value = cells[4].innerText;
    document.getElementById('editTimeOut').value = cells[5].innerText;

    const visitorId = row.getAttribute('data-id'); // Get visitor ID from data-id attribute
    console.log(visitorId)

    // const visitorId = row.dataset.id; // Assuming the visitor ID is stored in the dataset of the row
    document.getElementById('editModal').setAttribute('data-id', visitorId);

    // Show edit modal
    document.getElementById('editModal').style.display = 'block';

    document.getElementById('editModal').querySelector('.btn-primary').onclick = function() {
        updateVisitor(visitorId);
    };
}

// Function to close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function updateVisitor() {
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const phoneNumber = document.getElementById('editPhoneNumber').value;
    
    // Get the visitor ID from the edit form
    // const visitorId = row.getAttribute('data-id');
    // document.getElementById('editModal').getAttribute('data-visitor-id', visitorId);

    const visitorId = document.getElementById('editModal').getAttribute('data-id'); // Get visitorId from editModal
    console.log(visitorId)

    // Send PUT request to update visitor data
    axios.put(`http://localhost:3001/visitors/${visitorId}`, { firstName, lastName, phoneNumber })
        .then(response => {
            // Handle successful update
            console.log('Visitor updated successfully:', response.data);
            // Reload the page or update the UI as needed
            alert("Visitor updated successfully")
            location.reload();
        })
        .catch(error => {
            // Handle error
            console.error('Error updating visitor:', error);
            // Display error message to the user or handle it as needed
        })
        .finally(() => {
            // Close edit modal
            closeEditModal();
        });
}

// Function to show the confirmation modal
function showConfirmationModal(row) {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';


    const visitorId = row.getAttribute('data-id'); // Get visitor ID from data-id attribute

    // Attach event listener to confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        deleteVisitor(visitorId);
        modal.style.display = 'none';
    });

    // Attach event listener to cancel delete button
    document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
        modal.style.display = 'none';
    });
}


function closeConfirmModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

// Function to delete the visitor
function deleteVisitor(visitorId) {
    axios.delete(`http://localhost:3001/visitors/${visitorId}`)
        .then(response => {
            // Handle successful deletion
            console.log('Visitor deleted successfully:', response.data);
            // Reload the page or update the UI as needed
            alert("Visitor deleted successfully");
            location.reload();
        })
        .catch(error => {
            // Handle error
            console.error('Error deleting visitor:', error);
            // Display error message to the user or handle it as needed
        });
}

// Call showConfirmationModal when delete button is clicked
function confirmDelete(visitorId) {
    showConfirmationModal(visitorId);
}



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
    axios.post('http://localhost:3001/visitors/checkout', { firstName, lastName, phoneNumber, timeOut })
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
