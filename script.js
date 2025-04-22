document.addEventListener('DOMContentLoaded', () => {
    // --- Sample Data ---
    // In a real application, this would come from a server/API
    const choliInventory = [
        {
            id: "CH001",
            name: "Royal Blue Embroidered Choli",
            image: "images/CH001.jpg", // Use relative path to your images folder
            size: "M",
            fabric: "Silk Blend",
            color: "Royal Blue",
            price: 1500,
            deposit: 3000,
            status: "Rented", // "Available", "Rented", "Maintenance"
            bookings: ["2025-05-10", "2025-05-11", "2025-06-20"] // Stored as YYYY-MM-DD
        },
        {
            id: "CH002",
            name: "Crimson Silk Choli",
            image: "images/CH002.png",
            size: "S",
            fabric: "Pure Silk",
            color: "Crimson Red",
            price: 1200,
            deposit: 2500,
            status: "Available",
            bookings: []
        },
        {
            id: "CH003",
            name: "Golden Sequined Choli",
            image: "images/CH003.jpeg",
            size: "L",
            fabric: "Georgette",
            color: "Gold",
            price: 2000,
            deposit: 4000,
            status: "Available",
            bookings: ["2025-04-25", "2025-04-26", "2025-04-27"] // Example past booking
        },
        {
            id: "CH004",
            name: "Simple Cotton Choli - Green",
            image: "placeholder.png", // Placeholder if no image
            size: "M",
            fabric: "Cotton",
            color: "Green",
            price: 500,
            deposit: 1000,
            status: "Maintenance",
            bookings: []
        },
         {
            id: "CH005",
            name: "Navratri Special Mirror Work",
            image: "placeholder.png",
            size: "XL",
            fabric: "Cotton Blend",
            color: "Multi-color",
            price: 1800,
            deposit: 3500,
            status: "Available",
            bookings: []
        }
    ];

    // --- DOM Elements ---
    const inventoryList = document.getElementById('inventory-list');
    const detailPane = document.getElementById('inventory-detail-pane');
    const detailPlaceholder = document.getElementById('detail-placeholder');
    const detailContent = document.getElementById('detail-content');
    const searchInput = document.getElementById('search-input');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentAreas = document.querySelectorAll('.main-content .content-area');
    const navListItems = document.querySelectorAll('.sidebar-nav li');
    const checkCodeInput = document.getElementById('check-code-input');
    const checkDateInput = document.getElementById('check-date-input');
    const checkAvailabilityBtn = document.getElementById('check-availability-btn');

    // --- Functions ---

    // Function to get status class for badge
    function getStatusClass(status) {
        if (!status) return ''; // Handle undefined status
        switch (status.toLowerCase()) {
            case 'available': return 'status-available';
            case 'rented': return 'status-rented';
            case 'maintenance': return 'status-maintenance';
            default: return '';
        }
    }

    // Function to display inventory list
    function displayInventoryList(items) {
        inventoryList.innerHTML = ''; // Clear current list
        if (!items || items.length === 0) {
            inventoryList.innerHTML = '<li class="placeholder-message" style="padding: 20px;">No items found.</li>';
            return;
        }

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('inventory-list-item');
            listItem.dataset.id = item.id; // Store ID for click handling

            const statusClass = getStatusClass(item.status);

            listItem.innerHTML = `
                <img src="${item.image || 'placeholder.png'}" alt="${item.name}" class="item-thumbnail">
                <div class="item-info">
                    <h4>${item.name || 'Unnamed Choli'}</h4>
                    <p>${item.id || 'NO-ID'} - ${item.size || '?'} - ${item.fabric || 'Unknown Fabric'}</p>
                </div>
                <span class="status-badge ${statusClass}">${item.status || 'Unknown'}</span>
            `;
            listItem.addEventListener('click', () => {
                displayItemDetails(item.id);
                // Highlight selected item
                 document.querySelectorAll('.inventory-list-item').forEach(li => li.classList.remove('selected'));
                 listItem.classList.add('selected');
            });
            inventoryList.appendChild(listItem);
        });
    }

    // Function to display details of a selected item
    function displayItemDetails(itemId) {
        const item = choliInventory.find(choli => choli.id === itemId);
        if (!item) {
            // Optionally show an error or reset the detail pane
             detailContent.classList.add('hidden');
             detailPlaceholder.classList.remove('hidden');
             detailPlaceholder.textContent = `Details for ${itemId} not found.`;
             return;
        }

        // Show detail content, hide placeholder
        detailPlaceholder.classList.add('hidden');
        detailContent.classList.remove('hidden');

        // Populate fields
        document.getElementById('detail-name').textContent = item.name || 'Unnamed Choli';
        document.getElementById('detail-code').textContent = item.id || 'NO-ID';
        document.getElementById('detail-image').src = item.image || 'placeholder.png';
        document.getElementById('detail-image').alt = item.name || 'Choli Image';
        document.getElementById('detail-size').textContent = item.size || 'N/A';
        document.getElementById('detail-fabric').textContent = item.fabric || 'N/A';
        document.getElementById('detail-color').textContent = item.color || 'N/A';
        document.getElementById('detail-price').textContent = item.price?.toFixed(2) || '0.00';
        document.getElementById('detail-deposit').textContent = item.deposit?.toFixed(2) || '0.00';

        const statusBadge = document.getElementById('detail-status');
        statusBadge.textContent = item.status || 'Unknown';
        statusBadge.className = `status-badge ${getStatusClass(item.status)}`; // Update class


        const bookingsList = document.getElementById('detail-bookings');
        const noBookingsMsg = document.getElementById('no-bookings-msg');
        bookingsList.innerHTML = ''; // Clear previous bookings

        if (item.bookings && item.bookings.length > 0) {
            // Sort bookings for display? Optional.
            // item.bookings.sort();
            item.bookings.forEach(date => {
                const li = document.createElement('li');
                li.textContent = date;
                bookingsList.appendChild(li);
            });
            bookingsList.classList.remove('hidden');
            noBookingsMsg.classList.add('hidden');
        } else {
            bookingsList.classList.add('hidden');
            noBookingsMsg.classList.remove('hidden');
        }
    }

     // Function to filter inventory based on search input
    function filterInventory() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredItems = choliInventory.filter(item => {
            // Check against potential null/undefined values
            const nameMatch = item.name?.toLowerCase().includes(searchTerm);
            const idMatch = item.id?.toLowerCase().includes(searchTerm);
            return nameMatch || idMatch;
        });
        displayInventoryList(filteredItems);
        // Reset detail view when search changes
        detailContent.classList.add('hidden');
        detailPlaceholder.classList.remove('hidden');
        detailPlaceholder.innerHTML = '<p>Select a choli from the list to view details.</p>'; // Reset placeholder text
        document.querySelectorAll('.inventory-list-item').forEach(li => li.classList.remove('selected'));
    }

     // Function to switch between main content views
    function switchView(viewName) {
        // Hide all content areas first
        contentAreas.forEach(area => area.classList.add('hidden'));

        // Find and show the selected content area
        const activeArea = document.querySelector(`.${viewName}-view`);
        if (activeArea) {
            activeArea.classList.remove('hidden');
            // Reapply flex display specifically for inventory view if needed
            if (viewName === 'inventory') {
                 activeArea.style.display = 'flex';
            } else {
                 activeArea.style.display = 'block'; // Or default display
            }
        } else {
            // Fallback to dashboard if view not found
            const dashboardView = document.querySelector('.dashboard-view');
            if(dashboardView) dashboardView.classList.remove('hidden');
            viewName = 'dashboard'; // Correct the viewName for header/nav update
             console.warn(`View "${viewName}" not found. Showing dashboard.`);
        }


        // Update active state in sidebar
        navListItems.forEach(li => li.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.closest('li').classList.add('active');
        } else {
             // If viewName was corrected to dashboard, highlight dashboard
             const dashboardLink = document.querySelector(`.nav-link[data-view="dashboard"]`);
             if(dashboardLink) dashboardLink.closest('li').classList.add('active');
        }

        // Update main header title
         const mainHeader = document.querySelector('.main-header h1');
         if(mainHeader) {
             // Capitalize first letter for the title
             const title = viewName.charAt(0).toUpperCase() + viewName.slice(1);
             mainHeader.textContent = `${title}`; // Simpler title
         }
    }

    // Function: Check Availability
    function checkAvailability() {
        const code = checkCodeInput.value.trim().toUpperCase();
        const dateStr = checkDateInput.value; // HTML date input gives YYYY-MM-DD format

        if (!code) {
            alert("Please enter a Choli Code to check.");
            checkCodeInput.focus();
            return;
        }
        if (!dateStr) {
            // Basic check if date field is empty
            alert("Please select a Date to check.");
            checkDateInput.focus();
            return;
        }
         // Optional: More robust date validation if needed, e.g., using Date object
         // try {
         //     const parsedDate = new Date(dateStr + 'T00:00:00'); // Avoid timezone issues
         //     if (isNaN(parsedDate.getTime())) {
         //         throw new Error("Invalid date value");
         //     }
         //     // Use parsedDate if needed for comparisons later
         // } catch (e) {
         //     alert("Invalid Date selected. Please use the date picker.");
         //     return;
         // }


        // Find the choli in our sample data
        const item = choliInventory.find(choli => choli.id === code);

        if (!item) {
            alert(`Choli with code '${code}' not found in the inventory.`);
            return;
        }

        // Check if the date exists in the bookings array
        // Ensure bookings array exists before checking includes()
        if (item.bookings && item.bookings.includes(dateStr)) {
            alert(`❌ Choli '${code}' is BOOKED on ${dateStr}.`);
        } else {
            // Also consider the item's overall status
            if (item.status?.toLowerCase() === 'maintenance') {
                 alert(`⚠️ Choli '${code}' is marked for MAINTENANCE and may not be available on ${dateStr}, even if not booked.`);
            } else {
                 alert(`✅ Choli '${code}' is AVAILABLE on ${dateStr}.`);
            }
        }
    }


    // --- Event Listeners ---
    searchInput.addEventListener('input', filterInventory);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const view = link.dataset.view;
            switchView(view);
        });
    });

    checkAvailabilityBtn.addEventListener('click', checkAvailability);

    // --- Initial Load ---
    displayInventoryList(choliInventory); // Load initial list
    switchView('inventory'); // Start on the inventory view by default
});
