document.addEventListener('DOMContentLoaded', function() {
    // Fetch collections data from backend API
    axios.get('http://localhost:3001/visitors/collections')
        .then(response => {
            const collections = response.data;

            // Sort collections by date in ascending order
            collections.sort((a, b) => new Date(a.name) - new Date(b.name));

            // Loop through collections
            collections.forEach(collection => {
                // Create table row for each collection
                const row = createTableRow(collection);
                
                // Append the row to the table body
                const tableBody = document.getElementById('collections-body');
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching collections:', error);
        });
});

// Function to create a table row for a collection
function createTableRow(collection) {
    const row = document.createElement('tr');

    // Create table cells for collection name and total visitors count
    const collectionNameCell = document.createElement('td');
    collectionNameCell.textContent = collection.name;
    row.appendChild(collectionNameCell);

    const totalVisitorsCell = document.createElement('td');
    totalVisitorsCell.textContent = collection.totalVisitors;
    row.appendChild(totalVisitorsCell);

    // Create view button
    const viewButtonCell = document.createElement('td');
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => {
        displayCollectionData(collection.name);
    });
    viewButtonCell.appendChild(viewButton);
    row.appendChild(viewButtonCell);

    return row;
}

// Function to display data in selected collection
function displayCollectionData(collectionName) {
    // Fetch data from selected collection
    axios.get(`http://localhost:3001/visitors/collections/${collectionName}`)
        .then(response => {
            const data = response.data;
            // Open modal and display collection data
            openModal(collectionName, data);
        })
        .catch(error => {
            console.error(`Error fetching data from collection '${collectionName}':`, error);
        });
}

// Function to open modal and display collection data
function openModal(collectionName, data) {
    const modal = document.getElementById('collectionModal');
    const collectionDataBody = document.getElementById('collectionData');

    // Clear previous data
    collectionDataBody.innerHTML = '';

    // Set modal title
    modal.querySelector('h2').innerText = `Visitors Info - ${collectionName}`;

    // Create and populate table
    for (const item of data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.firstName}</td>
            <td>${item.lastName}</td>
            <td>${item.phoneNumber}</td>
            <td>${item.visitee}</td>
            <td>${item.timeIn}</td>
            <td>${item.timeOut}</td>
        `;
        collectionDataBody.appendChild(row);
    }

    // Display modal
    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('collectionModal');
    modal.style.display = 'none';
}


// Function to search and filter by date
function searchByDate() {
    const inputDate = document.getElementById('searchDate').value;
    const tableRows = document.querySelectorAll('#collections-body tr');

    // Loop through each row in the table
    tableRows.forEach(row => {
        const dateCell = row.querySelector('td:first-child');
        const rowDate = dateCell.textContent;
        const formattedInputDate = inputDate.replaceAll('-', '/'); // Adjust format if necessary

        // If the input date matches the row date, display the row; otherwise, hide it
        if (rowDate === formattedInputDate) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}